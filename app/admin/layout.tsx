export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Admin Sidebar */}
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
