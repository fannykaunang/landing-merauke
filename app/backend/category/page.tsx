// app/backend/category.page.tsx

import KelolaCategoryClient from "./_client";
import { generatePageMetadata } from "@/lib/helpers/metadata-helper";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Kelola Kategori",
    path: "/backend/category",
    noIndex: true,
  });
}

export default function KelolaCategoryPage() {
  return <KelolaCategoryClient />;
}
