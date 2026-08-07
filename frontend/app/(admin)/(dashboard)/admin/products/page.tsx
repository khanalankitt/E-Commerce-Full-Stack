"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CircleAlert,
  Package,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import Modal from "@/components/admin/modal";
import ImageUploadInput from "@/components/admin/imageUpload";
import type { Product, Category } from "../lib/types";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
} from "../lib/api";

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  _id: string;
  imageFile: File | null;
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  _id: "",
  imageFile: null,
};

const LOW_STOCK_THRESHOLD = 5;

const fmt = (n: number): string => "Rs. " + n.toLocaleString("en-IN");

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [saving, setSaving] = useState<boolean>(false);

  const loadData = (): void => {
    setLoading(true);
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch((err: Error) =>
        Swal.fire({
          icon: "error",
          title: "Couldn't load products",
          text: err.message,
        }),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        if (cancelled) return;
        setProducts(p);
        setCategories(c);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          Swal.fire({
            icon: "error",
            title: "Couldn't load products",
            text: err.message,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => {
    const inventoryValue = products.reduce(
      (sum, p) => sum + p.price * p.stock,
      0,
    );
    const lowStock = products.filter(
      (p) => p.stock <= LOW_STOCK_THRESHOLD,
    ).length;
    const featured = products.filter((p) => p.isFeatured).length;
    return { inventoryValue, lowStock, featured };
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q),
    );
  }, [products, query]);

  const openAddModal = (): void => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (product: Product): void => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      _id: product.category?._id ?? "",
      imageFile: null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!form.name.trim() || !form._id || !form.price || !form.stock) {
      Swal.fire({
        icon: "warning",
        title: "Please fill in all required fields",
      });
      return;
    }
    if (!editing && !form.imageFile) {
      Swal.fire({ icon: "warning", title: "Please choose an image" });
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("category", form._id);
    if (form.imageFile) fd.append("image", form.imageFile);

    setSaving(true);
    try {
      if (editing) {
        await updateProduct(editing._id, fd);
        await Swal.fire({
          icon: "success",
          title: "Product updated",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await createProduct(fd);
        await Swal.fire({
          icon: "success",
          title: "Product added",
          timer: 1400,
          showConfirmButton: false,
        });
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Save failed",
        text: (err as Error).message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product): Promise<void> => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Delete "${product.name}"?`,
      text: "This cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#C2410C",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteProduct(product._id);
      await Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1200,
        showConfirmButton: false,
      });
      loadData();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: (err as Error).message,
      });
    }
  };

  return (
    <div className="mt-5" style={pageStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
            Products
          </h1>
          <p style={{ fontSize: 13, color: "#6B6B76", margin: 0 }}>
            {products.length} products in your store
          </p>
        </div>
        <button type="button" onClick={openAddModal} style={primaryButtonStyle}>
          <Plus size={15} /> Add product
        </button>
      </div>

      {/* Summary strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <MiniSummaryCard
          icon={Package}
          label="Total products"
          value={String(products.length)}
          color="#FF5A1F"
          bg="#FFF1E8"
        />
        <MiniSummaryCard
          icon={Wallet}
          label="Inventory value"
          value={fmt(summary.inventoryValue)}
          color="#3B82F6"
          bg="#EFF6FF"
        />
        <MiniSummaryCard
          icon={CircleAlert}
          label="Low stock"
          value={String(summary.lowStock)}
          color="#E8590C"
          bg="#FFF3EC"
        />
        <MiniSummaryCard
          icon={Sparkles}
          label="Featured"
          value={String(summary.featured)}
          color="#B08900"
          bg="#FFF9E8"
        />
      </div>

      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ position: "relative" }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8A8996",
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name or category…"
            style={{
              ...inputStyle,
              paddingLeft: 34,
              maxWidth: 320,
              background: "#fff",
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #E8E6E1",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "28px 20px" }}>
            <div
              style={{ height: 14, width: 200, borderRadius: 6, background: "#EFEDE8" }}
            />
            <div
              style={{
                height: 8,
                width: 140,
                borderRadius: 6,
                background: "#EFEDE8",
                marginTop: 8,
              }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            text={
              products.length === 0
                ? "No products yet. Add your first product."
                : "No products match your search."
            }
          />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Product", "Category", "Price", "Stock", "Rating", ""].map(
                  (h, i) => (
                    <th
                      key={h}
                      style={
                        i === 3 || i === 4 || i === 5
                          ? { ...thStyle, textAlign: "right" }
                          : thStyle
                      }
                    >
                      {h === "" ? "Actions" : h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={36}
                        height={36}
                        loading="lazy"
                        style={{
                          borderRadius: 8,
                          objectFit: "cover",
                          background: "#F5F3EF",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "#1C1B29",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 200,
                            }}
                          >
                            {p.name}
                          </span>
                          {p.isFeatured && (
                            <Star
                              size={13}
                              fill="#F5B301"
                              color="#F5B301"
                              aria-label="Featured"
                            />
                          )}
                        </div>
                        {p.description && (
                          <div
                            style={{
                              fontSize: 11.5,
                              color: "#8A8996",
                              maxWidth: 220,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {p.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={chipStyle}>
                      {p.category?.name ?? "—"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{fmt(p.price)}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <StockBadge stock={p.stock} />
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <Rating value={p.rating} />
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      style={iconButtonStyle}
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      style={{ ...iconButtonStyle, color: "#C2410C" }}
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal
          title={editing ? "Edit product" : "Add product"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                style={inputStyle}
                placeholder="e.g. Wireless Earbuds"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Category</label>
              <select
                value={form._id}
                onChange={(e) => setForm((f) => ({ ...f, _id: e.target.value }))}
                style={inputStyle}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div>
                <label style={labelStyle}>Price (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
              />
            </div>

            <ImageUploadInput
              label="Product image"
              existingImageUrl={editing?.image}
              onChange={(file) =>
                setForm((f) => ({ ...f, imageFile: file }))
              }
            />

            <button
              type="submit"
              disabled={saving}
              style={{
                ...primaryButtonStyle,
                width: "100%",
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Add product"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function MiniSummaryCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E6E1",
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: bg,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={17} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 10.5,
            color: "#8A8996",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#1C1B29",
            marginTop: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return <Badge bg="#FFF0EE" color="#E03131" text="Out of stock" />;
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return <Badge bg="#FFF3EC" color="#E8590C" text={`Low · ${stock}`} />;
  }
  return <Badge bg="#ECF9EE" color="#2F9E44" text={`${stock} in stock`} />;
}

function Badge({ bg, color, text }: { bg: string; color: string; text: string }) {
  return (
    <span
      style={{
        fontSize: 11.5,
        fontWeight: 600,
        background: bg,
        color,
        borderRadius: 999,
        padding: "3px 9px",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        fontWeight: 600,
        color: "#B08900",
      }}
    >
      <Star size={13} fill="#F5B301" color="#F5B301" />
      {value ? value.toFixed(1) : "—"}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "48px 20px",
        textAlign: "center",
        color: "#8A8996",
        fontSize: 13,
      }}
    >
      {text}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  width: "100%",
};
const primaryButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "#FF5A1F",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "9px 14px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
const iconButtonStyle: React.CSSProperties = {
  border: "1px solid #F0EEE9",
  background: "#FAFAF8",
  cursor: "pointer",
  borderRadius: 8,
  padding: 7,
  color: "#4B4A55",
  display: "inline-flex",
  alignItems: "center",
  marginLeft: 6,
};
const thStyle: React.CSSProperties = {
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "#8A8996",
  padding: "10px 20px",
  background: "#FAFAF8",
  borderBottom: "1px solid #F0EEE9",
  whiteSpace: "nowrap",
};
const tdStyle: React.CSSProperties = {
  padding: "11px 20px",
  fontSize: 13,
  color: "#4B4A55",
  borderBottom: "1px solid #F5F3EF",
  whiteSpace: "nowrap",
};
const chipStyle: React.CSSProperties = {
  fontSize: 12,
  background: "#FAFAF8",
  border: "1px solid #F0EEE9",
  borderRadius: 6,
  padding: "3px 8px",
  color: "#4B4A55",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 600,
  marginBottom: 6,
  color: "#4B4A55",
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #E8E6E1",
  borderRadius: 8,
  padding: "9px 11px",
  fontSize: 13.5,
  boxSizing: "border-box",
  fontFamily: "inherit",
  color: "#1C1B29",
};
