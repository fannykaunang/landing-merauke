// app/layout.tsx (UPDATED)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context"; // ✅ TAMBAHKAN INI

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal Website & Aplikasi - Kabupaten Merauke",
  description: "Portal Website dan Aplikasi Pemerintah Kabupaten Merauke",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {/* ✅ WRAP DENGAN AuthProvider */}
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
