// components/website-grid.tsx

"use client";

import { Globe, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WebsiteCard } from "@/components/website-card";
import { Website } from "@/lib/types";

interface WebsiteGridProps {
  websites: Website[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

export function WebsiteGrid({
  websites,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  searchQuery,
  selectedCategory,
}: WebsiteGridProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <section
        id="website"
        className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-5">
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (websites.length === 0) {
    return (
      <section
        id="website"
        className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Daftar{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                Website & Aplikasi
              </span>
            </h2>
          </div>
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Globe className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tidak Ada Hasil
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? `Tidak ditemukan website dengan kata kunci "${searchQuery}"`
                : selectedCategory !== "all"
                ? "Tidak ada website dalam kategori ini"
                : "Belum ada website yang tersedia"}
            </p>
            <Button
              variant="outline"
              onClick={() => onPageChange(1)}
              className="border-gray-300 dark:border-gray-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Pencarian
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="website"
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Daftar{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Website & Aplikasi
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Website dan aplikasi resmi yang dikelola oleh Pemerintah Kabupaten
            Merauke
          </p>
        </div>

        {/* Website Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {websites.map((website, index) => (
            <WebsiteCard
              key={website.id}
              website={website}
              priority={index < 4}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-300 dark:border-gray-600">
              Sebelumnya
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, index, arr) => {
                  const prevPage = arr[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsis && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 ${
                          currentPage === page
                            ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white border-0"
                            : "border-gray-300 dark:border-gray-600"
                        }`}>
                        {page}
                      </Button>
                    </div>
                  );
                })}
            </div>

            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-300 dark:border-gray-600">
              Selanjutnya
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
