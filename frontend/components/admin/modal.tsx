"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(28,27,41,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 12, width: 480, maxWidth: "92vw",
          maxHeight: "88vh", overflowY: "auto", padding: 22,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            style={{ border: "none", background: "none", cursor: "pointer", padding: 4, color: "#6B6B76" }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}