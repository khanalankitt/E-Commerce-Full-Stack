"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setAuthorized(true);
        } else {
          router.replace("/adminLogin");
        }
      })
      .catch(() => {
        if (!cancelled) router.replace("/adminLogin");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!authorized) {
    return (
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8A8996",
          fontSize: 13,
        }}
      >
        Checking session…
      </div>
    );
  }

  return <>{children}</>;
}
