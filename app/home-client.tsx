// app/home-client.tsx

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { CategoryFilter } from "@/components/category-filter";
import { WebsiteGrid } from "@/components/website-grid";
import { Footer } from "@/components/footer";
import { Category, Website } from "@/lib/types";

export default function HomeClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWebsites, setTotalWebsites] = useState(0);
  const hasLoggedVisit = useRef(false);

  useEffect(() => {
    if (hasLoggedVisit.current) return;
    hasLoggedVisit.current = true;

    const logVisit = async () => {
      try {
        await fetch("/api/visitor-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentUrl: window.location.href }),
        });
      } catch (error) {
        console.error("Error logging visit:", error);
      }
    };

    logVisit();
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Fetch websites
  const fetchWebsites = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      if (activeSearch) {
        params.append("search", activeSearch);
      }

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`/api/websites?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setWebsites(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalWebsites(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching websites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, activeSearch, selectedCategory]);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch websites when filters change
  useEffect(() => {
    fetchWebsites();
  }, [fetchWebsites]);

  // Handle search
  const handleSearch = () => {
    setActiveSearch(searchQuery);
    setCurrentPage(1);
  };

  // Handle category change
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to website section
    document.getElementById("website")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          totalWebsites={totalWebsites}
          totalCategories={categories.length}
        />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <WebsiteGrid
          websites={websites}
          isLoading={isLoading}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          searchQuery={activeSearch}
          selectedCategory={selectedCategory}
        />
      </main>
      <Footer />
    </div>
  );
}
