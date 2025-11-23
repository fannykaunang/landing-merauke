// app/backend/layout.tsx
// ⭐ NEXT.JS LAYOUT (bukan component wrapper)

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import BackendHeader from "@/components/backend/header";
import { Footer } from "@/components/backend/footer";
import { Loader2 } from "lucide-react";

export default function BackendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Memuat...
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Render layout with header and footer
  // This will wrap ALL pages in /backend/* automatically
  return (
    <>
      <BackendHeader />
      {children}
      <Footer />
    </>
  );
}
