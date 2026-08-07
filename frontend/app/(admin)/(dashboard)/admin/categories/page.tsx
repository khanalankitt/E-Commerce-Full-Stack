"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Modal from "@/components/admin/modal";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../lib/api";
import type { Category } from "../lib/types";

interface CategoryFormState {
  name: string;
  slug: string;
}

const emptyForm: CategoryFormState = { name: "", slug: "" };

const palette = ["#FF5A1F", "#3B82F6", "#16A34A", "#8B5CF6", "#E8590C", "#0CA5E9"];

const colorFor = (name: string): string => {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return palette[h % palette.length];
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [saving, setSaving] = useState<boolean>(false);

  const loadCategories = (): void => {
    setLoading(true);
    getCategories()
      .then((c) => setCategories(c))
      .catch((err: Error) =>
        Swal.fire({
          icon: "error",
          title: "Couldn't load categories",
          text: err.message,
        }),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((c) => {
        if (cancelled) return;
        setCategories(c);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          Swal.fire({
            icon: "error",
            title: "Couldn't load categories",
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

  const openAddModal = (): void => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (category: Category): void => {
    setEditing(category);
    setForm({ name: category.name, slug: category.slug });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!form.name.trim()) {
      Swal.fire({ icon: "warning", title: "Category name is required" });
      return;
    }
    if (!form.slug.trim()) {
      Swal.fire({ icon: "warning", title: "Slug is required" });
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing._id, form.name.trim(), form.slug.trim());
        await Swal.fire({
          icon: "success",
          title: "Category updated",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await createCategory(form.name.trim(), form.slug.trim());
        await Swal.fire({
          icon: "success",
          title: "Category added",
          timer: 1400,
          showConfirmButton: false,
        });
      }
      setModalOpen(false);
      loadCategories();
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

  const handleDelete = async (category: Category): Promise<void> => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Delete "${category.name}"?`,
      text: "Products in this category won't be deleted, but they'll lose their category.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#C2410C",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteCategory(category._id);
      await Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1200,
        showConfirmButton: false,
      });
      loadCategories();
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
            Categories
          </h1>
          <p style={{ fontSize: 13, color: "#6B6B76", margin: 0 }}>
            {categories.length} categories in your store
          </p>
        </div>
        <button type="button" onClick={openAddModal} style={primaryButtonStyle}>
          <Plus size={15} /> Add category
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
        ) : categories.length === 0 ? (
          <EmptyState text="No categories yet. Add your first category." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Category", "Slug", ""].map((h, i) => (
                  <th
                    key={h}
                    style={i === 2 ? { ...thStyle, textAlign: "right" } : thStyle}
                  >
                    {h === "" ? "Actions" : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background: `${colorFor(c.name)}1F`,
                          color: colorFor(c.name),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 13,
                          flexShrink: 0,
                        }}
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#1C1B29",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 12,
                        background: "#FAFAF8",
                        border: "1px solid #F0EEE9",
                        borderRadius: 6,
                        padding: "3px 8px",
                        color: "#6B6B76",
                      }}
                    >
                      /{c.slug}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(c)}
                      style={iconButtonStyle}
                      aria-label={`Edit ${c.name}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c)}
                      style={{ ...iconButtonStyle, color: "#C2410C" }}
                      aria-label={`Delete ${c.name}`}
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
          title={editing ? "Edit category" : "Add category"}
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
                placeholder="e.g. Electronics"
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                style={inputStyle}
                placeholder="e.g. electronics"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              style={{
                ...primaryButtonStyle,
                width: "100%",
                justifyContent: "center",
              }}
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Add category"}
            </button>
          </form>
        </Modal>
      )}
    </div>
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
