// app/page.tsx

import { generatePageMetadata } from "@/lib/helpers/metadata-helper";
import HomeClient from "./home-client";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Pemerintah Kabupaten Merauke",
    path: "/",
  });
}

export default function HomePage() {
  return <HomeClient />;
}
