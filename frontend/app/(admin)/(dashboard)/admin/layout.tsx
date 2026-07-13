import Sidebar from "@/components/admin/sidebar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="pl-60 pr-5">{children}</main>
    </>
  );
}
