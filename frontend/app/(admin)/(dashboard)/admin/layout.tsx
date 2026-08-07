import Sidebar from "@/components/admin/sidebar";
import AuthGuard from "@/components/admin/AuthGuard";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Sidebar />
      <main
        className="pl-60 pr-5"
        style={{ height: "100vh", overflowY: "auto", boxSizing: "border-box" }}
      >
        {children}
      </main>
    </AuthGuard>
  );
}
