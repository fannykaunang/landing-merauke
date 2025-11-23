// app/backend/website/page.tsx

import { Metadata } from "next";
import KelolaWebsitesClient from "./_client";

export const metadata: Metadata = {
  title: "Kelola Pengguna | Portal Merauke",
  description: "Kelola semua website dan aplikasi Portal Merauke",
};

export default function KelolaWebsitesPage() {
  return <KelolaWebsitesClient />;
}
