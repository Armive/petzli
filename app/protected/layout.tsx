import VerticalSidebar from "@/components/sidebar/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex h-screen w-full">
      <VerticalSidebar />

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
