"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Tag,
  UserCircle,
  Zap,
} from "lucide-react";
import Swal from "sweetalert2";
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
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Sign out?",
      text: "You will be returned to the admin login page.",
      showCancelButton: true,
      confirmButtonText: "Sign out",
      confirmButtonColor: "#FF5A1F",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
    router.replace("/adminLogin");
  };

  return (
    <div
      className="absolute h-screen top-0 left-0"
      style={{ fontFamily: "'Inter', sans-serif", zIndex: 40 }}
    >
      <aside
        style={{
          width: 220,
          height: "100%",
          background: "#1C1B29",
          color: "#F4F3F0",
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px 16px",
          boxSizing: "border-box",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 6px 22px",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "#FF5A1F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Zap size={16} color="#1C1B29" fill="#1C1B29" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>
              Jhatpat
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: "#8A8996",
                marginTop: 3,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              Admin
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="admin-nav-link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  textDecoration: "none",
                  color: active ? "#F4F3F0" : "#A6A4B0",
                  background: active
                    ? "rgba(255,90,31,0.14)"
                    : "transparent",
                  boxShadow: active ? "inset 3px 0 0 0 #FF5A1F" : "none",
                }}
              >
                <Icon size={15} color={active ? "#FF8C5A" : "inherit"} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.08)",
              margin: "12px 6px 14px",
            }}
          />
          <button
            onClick={handleLogout}
            className="admin-logout-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              background: "transparent",
              color: "#A6A4B0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              padding: "8px 0",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
}
