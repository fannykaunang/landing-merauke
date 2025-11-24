// components/backend/footer.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [instansiName, setInstansiName] = useState(
    "Dinas Kominfo Kabupaten Merauke"
  );
  const [startYear, setStartYear] = useState<number>(currentYear);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");

        if (!response.ok) return;

        const result = await response.json();
        const name = result?.data?.instansi_nama;
        const year = result?.data?.tahun;

        if (name) {
          setInstansiName(name);
        }

        const parsedYear = typeof year === "string" ? parseInt(year, 10) : year;

        if (typeof parsedYear === "number" && !Number.isNaN(parsedYear)) {
          setStartYear(parsedYear);
        }
      } catch (error) {
        console.error("Failed to fetch app settings", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="container text-center mx-auto px-4 py-6">
        <Link
          href={"https://kominfo.merauke.go.id"}
          target="_blank"
          className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {startYear} - {currentYear} {instansiName}
        </Link>
      </div>
    </footer>
  );
}
