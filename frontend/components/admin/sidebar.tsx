"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Package, Tag, UserCircle, Zap } from "lucide-react";
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
      className="absolute h-screen overflow-hidden top-0 left-0"
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
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            background: "rgba(255,90,31,0.12)",
            color: "#FF8C5A",
            border: "1px solid rgba(255,90,31,0.3)",
            borderRadius: 8,
            padding: "9px 0",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </aside>
    </div>
  );
}
