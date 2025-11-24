// app/login/page.tsx

import { generatePageMetadata } from "@/lib/helpers/metadata-helper";
import LoginClient from "./login-client";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Login",
    path: "/login",
  });
}

export default function LoginPage() {
  return <LoginClient />;
}
