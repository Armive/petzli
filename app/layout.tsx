import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Petzli - Pet Social Network",
  description:
    "Petzli is a social network for pet lovers to share their pets, connect with other pet owners, and discover pet-related content.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground flex min-h-screen flex-col items-center">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!hasEnvVars ? <EnvVarWarning /> : null}
          <div className="flex w-full flex-1 flex-col items-center gap-20">
            <div className="flex max-w-5xl flex-col gap-20">{children}</div>

            <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-4 text-center text-xs">
              <p>
                Powered by{" "}
                <a
                  href="https://vercel.com/home"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Vercel
                </a>
              </p>
              <ThemeSwitcher />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
