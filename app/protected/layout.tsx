import VerticalSidebar from "@/components/sidebar/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex max-h-screen w-full">
      <VerticalSidebar />

      <main className="max-h-screen flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
