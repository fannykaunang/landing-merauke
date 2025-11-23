// app/backend/users/page.tsx

import { generatePageMetadata } from "@/lib/helpers/metadata-helper";
import KelolaWebsitesClient from "./_client";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Kelola Pengguna",
    path: "/backend/users",
    noIndex: true,
  });
}

export default function KelolaWebsitesPage() {
  return <KelolaWebsitesClient />;
}
