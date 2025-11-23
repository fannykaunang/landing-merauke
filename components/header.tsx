// componenets/header.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#beranda", label: "Beranda" },
    { href: "#kategori", label: "Kategori" },
    { href: "#website", label: "Website" },
    { href: "#tentang", label: "Tentang" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl">
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
                Kabupaten Merauke
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              className="hidden md:flex border-gray-300 dark:border-gray-600"
              asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button
              className="hidden md:flex bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
              asChild>
              <a
                href="https://portal.merauke.go.id"
                target="_blank"
                rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-0" />
                Portal Berita
              </a>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Portal Website</p>
                      <p className="text-xs text-gray-500 font-normal">
                        Kabupaten Merauke
                      </p>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600 mb-2"
                    asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Masuk
                    </Link>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    asChild>
                    <a
                      href="https://merauke.go.id"
                      target="_blank"
                      rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      merauke.go.id
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
