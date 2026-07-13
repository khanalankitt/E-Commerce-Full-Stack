"use client";

import React, { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

interface ImageUploadInputProps {
  label: string;
  existingImageUrl?: string; // when editing, show the current image
  onChange: (file: File | null) => void;
}

export default function ImageUploadInput({ label, existingImageUrl, onChange }: ImageUploadInputProps) {
  const [preview, setPreview] = useState<string | null>(existingImageUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined): void => {
    if (!file) {
      onChange(null);
      return;
    }
    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: "#4B4A55" }}>
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: "1.5px dashed #D9D6CF", borderRadius: 10, height: 120,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", overflow: "hidden", background: "#FAFAF8", position: "relative",
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#8A8996" }}>
            <ImagePlus size={22} />
            <span style={{ fontSize: 12 }}>Click to upload an image</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        style={{ display: "none" }}
      />
    </div>
  );
}