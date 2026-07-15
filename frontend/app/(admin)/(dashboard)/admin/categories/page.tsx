"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
      .then((c) => {
        //@ts-ignore
        setCategories(c.data);
      })
      .catch((err: Error) =>
        Swal.fire({
          icon: "error",
          title: "Couldn't load categories",
          text: err.message,
        }),
      )
      .finally(() => setLoading(false));
  };

  useEffect(loadCategories, []);
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

  const handleSubmit = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();

    if (!form.name.trim()) {
      Swal.fire({ icon: "warning", title: "Category name is required" });
      return;
    }
    if (!editing && !form.slug) {
      Swal.fire({ icon: "warning", title: "Please choose an image" });
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing._id, form.name, form.slug);
        Swal.fire({
          icon: "success",
          title: "Category updated",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await createCategory(form.name, form.slug);
        Swal.fire({
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
      Swal.fire({
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
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "20px 0 4px" }}>
            Categories
          </h1>
          <p style={{ fontSize: 13, color: "#6B6B76", margin: 0 }}>
            {categories?.length} categories
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
        ) : categories?.length === 0 ? (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              color: "#8A8996",
              fontSize: 13,
            }}
          >
            No categories yet.
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
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Slug</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((c) => (
                <tr key={c._id} style={{ borderTop: "1px solid #F0EEE9" }}>
                  <td style={tdStyle}>{c.name}</td>
                  <td style={tdStyle}>{c.slug}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(c)}
                      style={iconButtonStyle}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c)}
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
          title={editing ? "Edit category" : "Add category"}
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
                placeholder="e.g. Electronics"
              />
              <label style={labelStyle} className="mt-3">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
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
              {saving ? "Saving…" : editing ? "Save changes" : "Add category"}
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
