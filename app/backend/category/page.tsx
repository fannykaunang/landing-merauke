// app/backend/category.page.tsx

import { Metadata } from "next";
import KelolaCategoryClient from "./_client";

export const metadata: Metadata = {
  title: "Kelola Kategori | Portal Merauke",
  description: "Kelola kategori website Portal Merauke",
};

export default function KelolaCategoryPage() {
  return <KelolaCategoryClient />;
}
