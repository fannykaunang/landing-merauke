"use client";

import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  totalWebsites: number;
  totalCategories: number;
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  onSearch,
  totalWebsites,
  totalCategories,
}: HeroSectionProps) {
  return (
    <section
      id="beranda"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-10" />

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Dinas Kominfo Kabupaten Merauke</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Portal Website &{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Aplikasi
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-orange-500">
              {" "}
              Kabupaten Merauke
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Temukan berbagai website dan aplikasi resmi yang dikelola oleh
            Pemerintah Kabupaten Merauke untuk melayani masyarakat.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari website atau aplikasi..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-gray-400"
                />
              </div>
              <Button
                onClick={onSearch}
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25"
              >
                <span className="hidden sm:inline mr-2">Cari</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {totalWebsites}+
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Website & Aplikasi
              </p>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 hidden md:block" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {totalCategories}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Kategori
              </p>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 hidden md:block" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                24/7
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Akses Online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-gray-400 dark:bg-gray-600 rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  );
}
