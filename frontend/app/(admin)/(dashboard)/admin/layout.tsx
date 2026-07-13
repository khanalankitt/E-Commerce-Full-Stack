import Sidebar from "@/components/admin/sidebar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main>{children}</main>
    </>
  );
}
