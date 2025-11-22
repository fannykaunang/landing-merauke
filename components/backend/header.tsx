"use client";

import Link from "next/link";
import { Building2, Loader2, LogOut, User } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface BackendHeaderProps {
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  pageName?: string;
}

export default function BackendHeader({
  userName,
  userEmail,
  userRole,
  onLogout,
  isLoggingOut,
  pageName = "Dashboard",
}: BackendHeaderProps) {
  const displayName = userName || userEmail || "Pengguna";
  const displayRole = userRole || "Admin";
  const hasLogout = typeof onLogout === "function";

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl shadow-lg">
              <img
                src="/images/logo-merauke.png"
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
                Portal Website
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">
                {pageName}
              </p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {displayName}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                {displayRole}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={hasLogout ? onLogout : undefined}
              disabled={!hasLogout || isLoggingOut}
              className="border-gray-300 dark:border-gray-600">
              {isLoggingOut ? (
                <Loader />
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

function Loader() {
  return <Loader2 className="w-4 h-4 animate-spin" />;
}
