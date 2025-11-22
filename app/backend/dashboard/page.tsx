// app/backend/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, LayoutDashboard, Loader2, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/lib/types";
import BackendHeader from "@/components/backend/header";
import { Footer } from "@/components/backend/footer";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();

        if (!data.authenticated) {
          router.push("/login");
          return;
        }

        setUser(data.data.user);
      } catch (error) {
        console.error("Session check error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <BackendHeader
        userName={user?.name}
        userEmail={user?.email}
        userRole={user?.role}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        pageName="Dashboard"
      />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Selamat Datang, {user?.name || "Pengguna"}! 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Kelola website dan aplikasi Kabupaten Merauke dari dashboard
                ini.
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
              asChild>
              <Link href="/">
                <Globe className="w-4 h-4 mr-2" />
                Lihat Portal
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  10
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Website
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  5
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kategori
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <User className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  1
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pengguna Aktif
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Menu Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => router.push("/backend/website")}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Kelola Website
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tambah, edit, atau hapus website
            </p>
          </button>

          <button
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
            onClick={() => router.push("/backend/category")}>
            <LayoutDashboard className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Kelola Kategori
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Atur kategori website
            </p>
          </button>

          <button className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <User className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Kelola Pengguna
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Atur akses pengguna
            </p>
          </button>

          <button className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <Settings className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Pengaturan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Konfigurasi sistem
            </p>
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
