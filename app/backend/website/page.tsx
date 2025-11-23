// app/backend/website/page.tsx

import { generatePageMetadata } from "@/lib/helpers/metadata-helper";
import KelolaWebsitesClient from "./_client";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Kelola Websites",
    path: "/backend/website",
    noIndex: true,
  });
}

export default function KelolaWebsitesPage() {
  return <KelolaWebsitesClient />;
}
