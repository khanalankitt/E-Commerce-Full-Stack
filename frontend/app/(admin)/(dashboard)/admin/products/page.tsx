"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Modal from "@/components/admin/modal";
import ImageUploadInput from "@/components/admin/imageUpload";
import type { Category, Product } from "../lib/types";
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
  price: string; // kept as string while typing, parsed to number on submit
  stock: string;
  categoryId: string;
  imageFile: File | null;
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  imageFile: null,
};

const fmt = (n: number): string => "Rs. " + n.toLocaleString("en-IN");

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(loadData, []);

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
      categoryId: product.categoryId,
      imageFile: null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!form.name.trim() || !form.categoryId || !form.price || !form.stock) {
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
    fd.append("categoryId", form.categoryId);
    if (form.imageFile) fd.append("image", form.imageFile);

    setSaving(true);
    try {
      if (editing) {
        await updateProduct(editing._id, fd);
        Swal.fire({
          icon: "success",
          title: "Product updated",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await createProduct(fd);
        Swal.fire({
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
      Swal.fire({
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
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
            Products
          </h1>
          <p style={{ fontSize: 13, color: "#6B6B76", margin: 0 }}>
            {products.length} products
          </p>
        </div>
        <button type="button" onClick={openAddModal} style={primaryButtonStyle}>
          <Plus size={15} /> Add product
        </button>
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
          <div
            style={{
              padding: 24,
              textAlign: "center",
              color: "#8A8996",
              fontSize: 13,
            }}
          >
            Loading…
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              color: "#8A8996",
              fontSize: 13,
            }}
          >
            No products yet.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13.5,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#FAFAF8",
                  textAlign: "left",
                  fontSize: 11.5,
                  color: "#8A8996",
                  textTransform: "uppercase",
                }}
              >
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Category</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Price</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Stock</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderTop: "1px solid #F0EEE9" }}>
                  <td style={tdStyle}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={{ ...tdStyle, color: "#6B6B76" }}>
                    {p.categoryName ?? "—"}
                  </td>
                  <td
                    style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}
                  >
                    {fmt(p.price)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: p.stock <= 5 ? "#FFF1E8" : "#EAFBF6",
                        color: p.stock <= 5 ? "#C2410C" : "#0F9D8C",
                      }}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      style={iconButtonStyle}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      style={{ ...iconButtonStyle, color: "#C2410C" }}
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                style={inputStyle}
                placeholder="e.g. Wireless Earbuds"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Category</label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, categoryId: e.target.value }))
                }
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
              onChange={(file) => setForm((f) => ({ ...f, imageFile: file }))}
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
  border: "none",
  background: "none",
  cursor: "pointer",
  padding: 6,
  color: "#4B4A55",
};

const thStyle: React.CSSProperties = { padding: "10px 16px", fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: "10px 16px" };
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
};
