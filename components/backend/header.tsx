// components/backend/header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function BackendHeader() {
  const pathname = usePathname();
  const { user, logout, isLoggingOut } = useAuth();
  const [appAlias, setAppAlias] = useState("merauke.go.id");
  const [appLogo, setAppLogo] = useState("/images/logo-merauke.png");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");

        if (!response.ok) return;

        const result = await response.json();
        const aliasAplikasi = result?.data?.alias_aplikasi;
        const logo = result?.data?.logo;

        if (
          typeof aliasAplikasi === "string" &&
          aliasAplikasi.trim().length > 0
        ) {
          setAppAlias(aliasAplikasi);
        }

        if (typeof logo === "string" && logo.trim().length > 0) {
          setAppLogo(logo);
        }
      } catch (error) {
        console.error("Failed to fetch app settings", error);
      }
    };

    fetchSettings();
  }, []);

  // Auto-detect page name from pathname
  const getPageName = (): string => {
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/website")) return "Kelola Website";
    if (pathname.includes("/category")) return "Kelola Kategori";
    if (pathname.includes("/users")) return "Kelola Pengguna";
    if (pathname.includes("/statistics")) return "Statistik";
    if (pathname.includes("/settings")) return "Pengaturan";
    return "Dashboard";
  };

  const pageName = getPageName();
  const displayName = user?.name || user?.email || "Pengguna";
  const displayRole = user?.role === "admin" ? "Admin" : "User";

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl shadow-lg">
              <img
                src={appLogo}
                width={40}
                height={40}
                alt="Logo Kabupaten Merauke"
                className="w-10 h-10 object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                {appAlias}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">
                {pageName}
              </p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* User Info */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {displayName}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                {displayRole}
              </span>
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              disabled={isLoggingOut}
              className="border-gray-300 dark:border-gray-600">
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Keluar...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
