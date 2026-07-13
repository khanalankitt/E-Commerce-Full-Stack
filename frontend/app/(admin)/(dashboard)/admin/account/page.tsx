"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { changePassword, getAccount, updateAccount } from "../lib/api";
import type { AdminAccount } from "../lib/types";

interface ProfileFormState {
  name: string;
  email: string;
}

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const emptyPasswordForm: PasswordFormState = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function AccountPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<ProfileFormState>({ name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(emptyPasswordForm);
  const [savingPassword, setSavingPassword] = useState<boolean>(false);

  useEffect(() => {
    getAccount()
      .then((data: AdminAccount) => setProfile({ name: data.name, email: data.email }))
      .catch((err: Error) => Swal.fire({ icon: "error", title: "Couldn't load account", text: err.message }))
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
      await updateAccount({ name: profile.name.trim(), email: profile.email.trim() });
      Swal.fire({ icon: "success", title: "Profile updated", timer: 1400, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update failed", text: (err as Error).message });
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
      Swal.fire({ icon: "success", title: "Password changed", timer: 1400, showConfirmButton: false });
      setPasswordForm(emptyPasswordForm);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Change failed", text: (err as Error).message });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div style={{ fontSize: 13, color: "#8A8996" }}>Loading…</div>;
  }

  return (
    <div style={{ maxWidth: 460 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>Account</h1>

      <form onSubmit={handleProfileSubmit} style={cardStyle}>
        <h2 style={cardTitleStyle}>Profile</h2>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={savingProfile} style={primaryButtonStyle}>
          {savingProfile ? "Saving…" : "Save changes"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} style={cardStyle}>
        <h2 style={cardTitleStyle}>Change password</h2>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Current password</label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>New password</label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Confirm new password</label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={savingPassword} style={primaryButtonStyle}>
          {savingPassword ? "Saving…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff", border: "1px solid #E8E6E1", borderRadius: 12, padding: 20, marginBottom: 18,
};
const cardTitleStyle: React.CSSProperties = { fontSize: 14.5, fontWeight: 700, margin: "0 0 16px" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: "#4B4A55" };
const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #E8E6E1", borderRadius: 8, padding: "9px 11px",
  fontSize: 13.5, boxSizing: "border-box", fontFamily: "inherit",
};
const primaryButtonStyle: React.CSSProperties = {
  background: "#FF5A1F", color: "#fff", border: "none", borderRadius: 8,
  padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
};