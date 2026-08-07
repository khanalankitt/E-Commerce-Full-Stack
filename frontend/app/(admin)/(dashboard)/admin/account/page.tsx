"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  CalendarDays,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  LogOut,
  Mail,
  ShieldCheck,
  User,
  type LucideIcon,
} from "lucide-react";
import { changePassword, getAccount, updateAccount } from "../lib/api";
import type { AdminAccount } from "../lib/types";

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const emptyPasswordForm: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const formatDate = (iso?: string): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "A";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [account, setAccount] = useState<AdminAccount | null>(null);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  const [passwordForm, setPasswordForm] =
    useState<PasswordFormState>(emptyPasswordForm);
  const [savingPassword, setSavingPassword] = useState<boolean>(false);
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    getAccount()
      .then((data: AdminAccount) => {
        setAccount(data);
        setProfile({ name: data.name, email: data.email });
      })
      .catch((err: Error) =>
        Swal.fire({
          icon: "error",
          title: "Couldn't load account",
          text: err.message,
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      Swal.fire({ icon: "warning", title: "Name and email are required" });
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await updateAccount({
        name: profile.name.trim(),
        email: profile.email.trim(),
      });
      setAccount((prev) => (prev ? { ...prev, ...updated } : prev));
      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: (err as Error).message,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      Swal.fire({ icon: "warning", title: "Please fill in both password fields" });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire({ icon: "warning", title: "New passwords don't match" });
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(emptyPasswordForm);
      await Swal.fire({
        icon: "success",
        title: "Password changed",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Change failed",
        text: (err as Error).message,
      });
    } finally {
      setSavingPassword(false);
    }
  };

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

  if (loading) {
    return (
      <div style={{ fontSize: 13, color: "#8A8996", padding: "40px 0" }}>
        Loading…
      </div>
    );
  }

  const roleLabel = account?.role === "ADMIN" ? "Administrator" : "Member";
  const accountId = account?._id ?? "";

  return (
    <div
      className="mt-5"
      style={{ fontFamily: "'Inter', sans-serif", maxWidth: 1700 }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
        Account settings
      </h1>
      <p style={{ fontSize: 13, color: "#6B6B76", margin: "0 0 22px" }}>
        Manage your profile, security and account information.
      </p>

      {/* Profile hero card */}
      <div
        style={{
          ...cardStyle,
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            flexShrink: 0,
            background: "linear-gradient(135deg, #FF5A1F, #FF8C42)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 19,
            fontWeight: 700,
          }}
        >
          {initialsOf(account?.name ?? "")}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                margin: 0,
                color: "#1C1B29",
              }}
            >
              {account?.name}
            </h2>
            <span style={badgeStyle}>
              <ShieldCheck size={12} />
              {roleLabel}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#6B6B76",
              marginTop: 3,
            }}
          >
            <Mail size={13} />
            {account?.email}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <form onSubmit={handleProfileSubmit} style={cardStyle}>
            <CardHeader icon={User} title="Personal information" />
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Full name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={savingProfile} style={primaryButtonStyle}>
              {savingProfile ? "Saving…" : "Save changes"}
            </button>
          </form>

          <form onSubmit={handlePasswordSubmit} style={cardStyle}>
            <CardHeader icon={KeyRound} title="Security" />
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Current password</label>
              <PasswordInput
                value={passwordForm.currentPassword}
                visible={showPw.current}
                onChange={(v) =>
                  setPasswordForm((f) => ({ ...f, currentPassword: v }))
                }
                onToggle={() => setShowPw((s) => ({ ...s, current: !s.current }))}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>New password</label>
              <PasswordInput
                value={passwordForm.newPassword}
                visible={showPw.new}
                onChange={(v) =>
                  setPasswordForm((f) => ({ ...f, newPassword: v }))
                }
                onToggle={() => setShowPw((s) => ({ ...s, new: !s.new }))}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Confirm new password</label>
              <PasswordInput
                value={passwordForm.confirmPassword}
                visible={showPw.confirm}
                onChange={(v) =>
                  setPasswordForm((f) => ({ ...f, confirmPassword: v }))
                }
                onToggle={() => setShowPw((s) => ({ ...s, confirm: !s.confirm }))}
              />
            </div>
            <button type="submit" disabled={savingPassword} style={primaryButtonStyle}>
              {savingPassword ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={cardStyle}>
            <CardHeader icon={Fingerprint} title="Account details" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <DetailRow
                icon={ShieldCheck}
                label="Role"
                value={roleLabel}
              />
              <DetailRow
                icon={CalendarDays}
                label="Member since"
                value={formatDate(account?.createdAt)}
              />
              <DetailRow
                icon={CalendarDays}
                label="Last updated"
                value={formatDate(account?.updatedAt)}
              />
              <DetailRow
                icon={Fingerprint}
                label="Account ID"
                value={
                  accountId.length > 12
                    ? `${accountId.slice(0, 6)}…${accountId.slice(-4)}`
                    : accountId
                }
              />
            </div>
          </div>

          <div style={{ ...cardStyle, borderColor: "#F3C6B8" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1C1B29" }}>
                Session
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#2F9E44",
                  background: "rgba(47,158,68,0.12)",
                  borderRadius: 999,
                  padding: "3px 9px",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "#2F9E44",
                    display: "inline-block",
                  }}
                />
                Signed in
              </span>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: "#6B6B76",
                margin: "0 0 14px",
                lineHeight: 1.5,
              }}
            >
              You are signed in as an administrator. Signing out ends your
              current admin session.
            </p>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                background: "#FFF3EE",
                color: "#D9480F",
                border: "1px solid #F3C6B8",
                borderRadius: 8,
                padding: "9px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "rgba(255,90,31,0.12)",
          color: "#FF5A1F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={15} />
      </div>
      <h2 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: "#1C1B29" }}>
        {title}
      </h2>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: "#FAFAF8",
          border: "1px solid #E8E6E1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6B6B76",
          flexShrink: 0,
        }}
      >
        <Icon size={15} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11.5, color: "#8A8996", fontWeight: 500 }}>
          {label}
        </div>
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
          {value}
        </div>
      </div>
    </div>
  );
}

function PasswordInput({
  value,
  visible,
  onChange,
  onToggle,
}: {
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, paddingRight: 38 }}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          right: 4,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#8A8996",
          padding: 6,
          display: "flex",
          alignItems: "center",
        }}
      >
        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E8E6E1",
  borderRadius: 12,
  padding: 20,
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
const primaryButtonStyle: React.CSSProperties = {
  background: "#FF5A1F",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "9px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  fontSize: 11.5,
  fontWeight: 600,
  color: "#FF5A1F",
  background: "rgba(255,90,31,0.12)",
  borderRadius: 999,
  padding: "3px 9px",
  whiteSpace: "nowrap",
};
