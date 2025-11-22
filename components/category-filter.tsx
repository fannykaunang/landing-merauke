"use client";

import {
  Users,
  Briefcase,
  Code,
  Palette,
  ShoppingCart,
  LayoutGrid,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  users: Users,
  briefcase: Briefcase,
  code: Code,
  palette: Palette,
  "shopping-cart": ShoppingCart,
};

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <section id="kategori" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Jelajahi Berdasarkan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Kategori
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Temukan website dan aplikasi sesuai dengan kategori yang Anda
            butuhkan
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {/* All Category */}
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => onCategoryChange("all")}
            className={`rounded-xl h-auto py-3 px-5 transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-0"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            <LayoutGrid className="w-5 h-5 mr-2" />
            <span className="font-medium">Semua</span>
          </Button>

          {/* Category Buttons */}
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon || ""] || LayoutGrid;
            const isSelected = selectedCategory === category.slug;

            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onCategoryChange(category.slug)}
                className={`rounded-xl h-auto py-3 px-5 transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-0"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                <span className="font-medium">{category.name}</span>
                {category.website_count !== undefined && (
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {category.website_count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
