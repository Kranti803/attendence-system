import { Sidebar } from "@/components/layout/sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="student" />
      <main className="pl-[272px]">{children}</main>
    </div>
  );
}
