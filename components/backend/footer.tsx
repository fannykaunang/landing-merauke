"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="container text-center mx-auto px-4 py-6">
        <Link
          href={"https://kominfo.merauke.go.id"}
          target="_blank"
          className="text-center text-sm text-gray-500 dark:text-gray-400">
          © 2025 - {currentYear} Dinas Kominfo Kabupaten Merauke
        </Link>
      </div>
    </footer>
  );
}
