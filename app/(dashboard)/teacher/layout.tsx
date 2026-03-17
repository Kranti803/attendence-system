import { Sidebar } from "@/components/layout/sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="teacher" />
      <main className="pl-[272px]">{children}</main>
    </div>
  );
}
