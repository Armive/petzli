import VerticalSidebar from "@/components/sidebar/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      <VerticalSidebar />

      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
