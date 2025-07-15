import { Header } from "@/components/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Header />
      <div className="flex max-w-xs flex-col items-center gap-12 p-12">
        {children}
      </div>
    </div>
  );
}
