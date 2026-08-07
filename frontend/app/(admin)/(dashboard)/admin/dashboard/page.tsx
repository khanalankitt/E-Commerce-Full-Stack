"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  Boxes,
  CircleAlert,
  Layers,
  Package,
  RefreshCw,
  ShoppingCart,
  Star,
  Tag,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { getDashboardData } from "../lib/api";
import type { DashboardStats } from "../lib/types";

interface DashboardData {
  stats: DashboardStats;
  products: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
    isFeatured: boolean;
    rating: number;
    category?: { _id: string; name: string };
  }[];
  categories: { _id: string; name: string }[];
}

const LOW_STOCK_THRESHOLD = 5;

const rs = (n: number): string => "Rs. " + n.toLocaleString("en-IN");

const kpiCards: {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}[] = [
  { label: "Total products", icon: Package, color: "#FF5A1F", bg: "#FFF1E8" },
  { label: "Total categories", icon: Tag, color: "#3B82F6", bg: "#EFF6FF" },
  { label: "Total users", icon: Users, color: "#16A34A", bg: "#EFFAF0" },
  {
    label: "Total orders",
    icon: ShoppingCart,
    color: "#8B5CF6",
    bg: "#F3EFFF",
  },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const result = await getDashboardData();
      setData(result);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Couldn't load dashboard",
        text: (err as Error).message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getDashboardData()
      .then((result) => {
        if (!cancelled) setData(result);
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

  const derived = useMemo(() => {
    const products = data?.products ?? [];
    const categories = data?.categories ?? [];

    const inventoryValue = products.reduce(
      (sum, p) => sum + p.price * p.stock,
      0,
    );
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
    const avgPrice = products.length
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0;
    const featuredCount = products.filter((p) => p.isFeatured).length;
    const lowStock = products
      .filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.stock - b.stock);
    const healthyCount = products.filter(
      (p) => p.stock > LOW_STOCK_THRESHOLD,
    ).length;
    const healthyPct = products.length
      ? Math.round((healthyCount / products.length) * 100)
      : 0;
    const recent = products.slice(0, 6);
    const topRated = [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    const breakdown = categories
      .map((c) => ({
        name: c.name,
        count: products.filter((p) => p.category?._id === c._id).length,
      }))
      .filter((b) => b.count > 0)
      .sort((a, b) => b.count - a.count);
    const maxCatCount = breakdown.length ? breakdown[0].count : 0;

    return {
      inventoryValue,
      totalUnits,
      avgPrice,
      featuredCount,
      lowStock,
      healthyPct,
      recent,
      topRated,
      breakdown,
      maxCatCount,
    };
  }, [data]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="mt-5" style={pageStyle}>
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              height: 22,
              width: 180,
              borderRadius: 6,
              background: "#EFEDE8",
            }}
          />
          <div
            style={{
              height: 12,
              width: 280,
              borderRadius: 6,
              background: "#EFEDE8",
              marginTop: 8,
            }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
            marginBottom: 18,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ height: 130, borderRadius: 12, background: "#EFEDE8" }}
            />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
            gap: 18,
          }}
        >
          <div
            style={{ height: 210, borderRadius: 12, background: "#EFEDE8" }}
          />
          <div
            style={{ height: 210, borderRadius: 12, background: "#EFEDE8" }}
          />
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const values = [
    stats?.totalProducts ?? 0,
    stats?.totalCategories ?? 0,
    stats?.totalUsers ?? 0,
    stats?.totalOrders ?? 0,
  ];
  const subs = [
    `${derived.featuredCount} featured`,
    `${derived.breakdown.length} with products`,
    "registered accounts",
    "all time",
  ];

  return (
    <div className="mt-5" style={pageStyle}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 20,
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "#6B6B76", margin: 0 }}>{today}</p>
        </div>
        <button
          type="button"
          onClick={() => load(true)}
          disabled={refreshing}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#fff",
            color: "#4B4A55",
            border: "1px solid #E8E6E1",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* KPI cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 16,
          marginBottom: 18,
        }}
      >
        {kpiCards.map((card, i) => (
          <StatCard
            key={card.label}
            {...card}
            value={values[i]}
            sub={subs[i]}
          />
        ))}
      </div>

      {/* Inventory + Category breakdown */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
          gap: 18,
          marginBottom: 18,
        }}
      >
        <div style={cardStyle}>
          <SectionHeader
            icon={Wallet}
            title="Inventory overview"
            subtitle="Stock & pricing summary"
          />
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#1C1B29" }}>
              {rs(derived.inventoryValue)}
            </div>
            <div style={{ fontSize: 12.5, color: "#8A8996" }}>
              total inventory value
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
              margin: "18px 0",
            }}
          >
            <MiniStat
              label="Units in stock"
              value={String(derived.totalUnits)}
            />
            <MiniStat
              label="Avg. price"
              value={rs(Math.round(derived.avgPrice))}
            />
            <MiniStat label="Featured" value={String(derived.featuredCount)} />
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11.5,
                color: "#8A8996",
                marginBottom: 6,
              }}
            >
              <span>Stock health</span>
              <span>{derived.healthyPct}% healthy</span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: "#F0EEE9",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${derived.healthyPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #2F9E44, #69C779)",
                }}
              />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <SectionHeader
            icon={Layers}
            title="Category breakdown"
            subtitle="Products per category"
          />
          {derived.breakdown.length === 0 ? (
            <EmptyState text="No products to show yet." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {derived.breakdown.map((b) => (
                <div key={b.name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12.5,
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#4B4A55" }}>
                      {b.name}
                    </span>
                    <span style={{ color: "#8A8996" }}>
                      {b.count} product{b.count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 7,
                      borderRadius: 999,
                      background: "#F0EEE9",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${
                          derived.maxCatCount
                            ? Math.round((b.count / derived.maxCatCount) * 100)
                            : 0
                        }%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "#FF5A1F",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent products + side panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px 12px" }}>
            <SectionHeader
              icon={Boxes}
              title="Recent products"
              subtitle="Newest additions to your store"
            />
          </div>
          {derived.recent.length === 0 ? (
            <div style={{ padding: "0 20px 20px" }}>
              <EmptyState text="No products yet. Add your first product." />
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Product", "Category", "Price", "Stock", "Rating"].map(
                    (h) => (
                      <th key={h} style={thStyle}>
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {derived.recent.map((p) => (
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
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#1C1B29",
                            maxWidth: 180,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontSize: 12,
                          background: "#FAFAF8",
                          border: "1px solid #F0EEE9",
                          borderRadius: 6,
                          padding: "3px 8px",
                          color: "#4B4A55",
                        }}
                      >
                        {p.category?.name ?? "—"}
                      </span>
                    </td>
                    <td style={tdStyle}>{rs(p.price)}</td>
                    <td style={tdStyle}>
                      <StockBadge stock={p.stock} />
                    </td>
                    <td style={tdStyle}>
                      <Rating value={p.rating} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={cardStyle}>
            <SectionHeader
              icon={CircleAlert}
              title="Low stock alerts"
              subtitle="Items that need attention"
            />
            {derived.lowStock.length === 0 ? (
              <EmptyState text="All products are well stocked." />
            ) : (
              <div>
                {derived.lowStock.map((p) => (
                  <div key={p._id} style={rowStyle}>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1C1B29",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#8A8996",
                          marginTop: 1,
                        }}
                      >
                        {p.category?.name ?? "—"}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>
                        {rs(p.price)}
                      </span>
                      <StockBadge stock={p.stock} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <SectionHeader
              icon={TrendingUp}
              title="Top rated"
              subtitle="Highest rated products"
            />
            {derived.topRated.length === 0 ? (
              <EmptyState text="No products to rate yet." />
            ) : (
              <div>
                {derived.topRated.map((p) => (
                  <div key={p._id} style={rowStyle}>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1C1B29",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#8A8996",
                          marginTop: 1,
                        }}
                      >
                        {p.category?.name ?? "—"}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexShrink: 0,
                      }}
                    >
                      <Rating value={p.rating} />
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>
                        {rs(p.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  icon: Icon,
  color,
  bg,
  value,
  sub,
}: {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  value: number;
  sub: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E6E1",
        borderRadius: 12,
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: bg,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={16} />
        </div>
        <TrendingUp size={14} color="#C9C7C0" />
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: "#6B6B76",
          marginTop: 6,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 11.5, color: "#A09E97", marginTop: 2 }}>
        {sub}
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "#FFF1E8",
          color: "#FF5A1F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={16} />
      </div>
      <div>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1C1B29" }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11.5, color: "#8A8996" }}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#FAFAF8",
        border: "1px solid #F0EEE9",
        borderRadius: 10,
        padding: "12px 14px",
      }}
    >
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
          fontSize: 16,
          fontWeight: 700,
          color: "#1C1B29",
          marginTop: 4,
          whiteSpace: "nowrap",
        }}
      >
        {value}
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

function Badge({
  bg,
  color,
  text,
}: {
  bg: string;
  color: string;
  text: string;
}) {
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
        padding: "20px 0",
        textAlign: "center",
        color: "#8A8996",
        fontSize: 12.5,
      }}
    >
      {text}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E8E6E1",
  borderRadius: 12,
  padding: 18,
};
const pageStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  maxWidth: 1700,
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
const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: "10px 0",
  borderBottom: "1px solid #F5F3EF",
};
