"use client";

import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const quickLinks = [
    { label: "Beranda", href: "#beranda" },
    { label: "Kategori", href: "#kategori" },
    { label: "Website", href: "#website" },
    { label: "Tentang", href: "#tentang" },
  ];

  return (
    <footer
      id="tentang"
      className="bg-gray-900 dark:bg-gray-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Portal Website & Aplikasi</h3>
                <p className="text-sm text-gray-400">Kabupaten Merauke</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              Portal ini menyediakan akses ke berbagai website dan aplikasi
              resmi yang dikelola oleh Pemerintah Kabupaten Merauke melalui
              Dinas Komunikasi dan Informatika.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-300">
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Navigasi</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Jl. Raya Mandala, Merauke
                  <br />
                  Papua Selatan, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <a
                  href="tel:+62971321XXX"
                  className="text-gray-400 hover:text-white transition-colors text-sm">
                  (0971) 321-XXX
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <a
                  href="mailto:kominfo@merauke.go.id"
                  className="text-gray-400 hover:text-white transition-colors text-sm">
                  kominfo@merauke.go.id
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-500 shrink-0" />
                <a
                  href="https://merauke.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm">
                  merauke.go.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-gray-800 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2025 - {currentYear} Pemerintah Kabupaten Merauke. Hak Cipta
            Dilindungi.
          </p>
          <p className="text-gray-500 text-sm sm:text-center">
            Dikelola oleh{" "}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors me-2">
              Dinas Kominfo Kabupaten Merauke.
            </a>
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors">
              Login
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
