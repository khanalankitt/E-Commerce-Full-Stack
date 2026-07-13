"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, UserCircle, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Account", href: "/admin/account", icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#FAFAF8",
        minHeight: "100vh",
        display: "flex",
        color: "#1C1B29",
      }}
    >
      <aside
        style={{
          width: 220,
          background: "#1C1B29",
          color: "#F4F3F0",
          flexShrink: 0,
          padding: "22px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 8px",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#FF5A1F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={16} color="#1C1B29" fill="#1C1B29" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Jhatpat</span>
          <span style={{ fontSize: 11, color: "#8A8996" }}>admin</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: 500,
                  textDecoration: "none",
                  color: active ? "#F4F3F0" : "#A6A4B0",
                  background: active ? "rgba(255,90,31,0.14)" : "transparent",
                  borderLeft: active
                    ? "3px solid #FF5A1F"
                    : "3px solid transparent",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
