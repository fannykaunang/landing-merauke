// app/backend/dashboard/page.tsx
// ✅ Server Component dengan Dynamic Metadata

import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/helpers/metadata-helper";
import DashboardClient from "./_client";

// ============================================
// METADATA (Server Component)
// ============================================
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Dashboard",
    description:
      "Dashboard admin untuk mengelola website, kategori, dan pengguna Portal Kabupaten Merauke",
    path: "/backend/dashboard",
    keywords: [
      "dashboard",
      "admin",
      "backend",
      "merauke",
      "portal",
      "manajemen",
    ],
    noIndex: true, // Backend pages tidak perlu diindex Google
  });
}

// ============================================
// SERVER COMPONENT (Page)
// ============================================
export default function DashboardPage() {
  return <DashboardClient />;
}
