"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Tag,
  Users,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import { getStats } from "../lib/api";
import type { DashboardStats } from "../lib/types";

interface StatCardConfig {
  key: keyof DashboardStats;
  label: string;
  icon: LucideIcon;
}

const cards: StatCardConfig[] = [
  { key: "totalProducts", label: "Total products", icon: Package },
  { key: "totalCategories", label: "Total categories", icon: Tag },
  { key: "totalUsers", label: "Total users", icon: Users },
  { key: "totalOrders", label: "Total orders", icon: ShoppingCart },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    getStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err: Error) => {
        Swal.fire({
          icon: "error",
          title: "Couldn't load dashboard",
          text: err.message,
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-5">
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
        Dashboard
      </h1>
      <p style={{ fontSize: 13, color: "#6B6B76", margin: "0 0 22px" }}>
        A quick look at your store.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        {cards.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            style={{
              background: "#fff",
              border: "1px solid #E8E6E1",
              borderRadius: 12,
              padding: "18px 20px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#FFF1E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Icon size={16} color="#FF5A1F" />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {loading ? "…" : (stats?.[key] ?? 0)}
            </div>
            <div style={{ fontSize: 12.5, color: "#6B6B76", marginTop: 2 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
