import { Sidebar } from "@/components/layout/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar role="admin" />
      <SidebarInset className="bg-background">{children}</SidebarInset>
    </SidebarProvider>
  );
}
