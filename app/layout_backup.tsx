import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portal Website & Aplikasi | Kabupaten Merauke",
  description:
    "Daftar website dan aplikasi yang dikelola oleh Dinas Komunikasi dan Informatika Kabupaten Merauke",
  keywords: [
    "Merauke",
    "Papua Selatan",
    "Pemerintah",
    "Website",
    "Aplikasi",
    "Kominfo",
  ],
  authors: [{ name: "Dinas Kominfo Kabupaten Merauke" }],
  openGraph: {
    title: "Portal Website & Aplikasi | Kabupaten Merauke",
    description:
      "Daftar website dan aplikasi yang dikelola oleh Dinas Komunikasi dan Informatika Kabupaten Merauke",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
