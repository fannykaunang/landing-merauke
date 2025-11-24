"use client";

import { useEffect, useState } from "react";
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
  const [instansiName, setInstansiName] = useState(
    "Dinas Kominfo Kabupaten Merauke"
  );
  const [appAlias, setAppAlias] = useState("merauke.go.id");
  const [appDeskripsi, setAppDeskripsi] = useState(
    "Portal Website dan Aplikasi Pemerintah Kabupaten Merauke"
  );
  const [startYear, setStartYear] = useState<number>(currentYear);
  const [instansiAlamat, setInstansiAlamat] = useState(
    "Jl. TMP Trikora No. 78, Kel. Maro. Merauke, Papua Selatan"
  );
  const [instansiTelepon, setInstansiTelepon] = useState("0971-321123");
  const [instansiEmail, setInstansiEmail] = useState("portal@merauke.go.id");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");

        if (!response.ok) return;

        const result = await response.json();
        const name = result?.data?.instansi_nama;
        const aliasAplikasi = result?.data?.alias_aplikasi;
        const deskAplikasi = result?.data?.deskripsi;
        const alamatInstansi = result?.data?.alamat;
        const telpInstansi = result?.data?.no_telepon;
        const emailInstansi = result?.data?.email;
        const year = result?.data?.tahun;

        if (name) {
          setInstansiName(name);
        }

        if (
          typeof aliasAplikasi === "string" &&
          aliasAplikasi.trim().length > 0
        ) {
          setAppAlias(aliasAplikasi);
        }

        if (
          typeof deskAplikasi === "string" &&
          deskAplikasi.trim().length > 0
        ) {
          setAppDeskripsi(deskAplikasi);
        }

        if (
          typeof telpInstansi === "string" &&
          telpInstansi.trim().length > 0
        ) {
          setInstansiTelepon(telpInstansi);
        }

        if (
          typeof emailInstansi === "string" &&
          emailInstansi.trim().length > 0
        ) {
          setInstansiEmail(emailInstansi);
        }

        if (
          typeof alamatInstansi === "string" &&
          alamatInstansi.trim().length > 0
        ) {
          setInstansiAlamat(alamatInstansi);
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
              <div className="flex items-center justify-center w-12 h-12 rounded-xl shadow-lg">
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
              <div>
                <h3 className="text-xl font-bold">{appAlias}</h3>
                <p className="text-sm text-gray-400">{instansiName}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              {appDeskripsi}.<br></br>
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
                  {instansiAlamat}
                  <br />
                  Papua Selatan, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <a
                  href="tel:+62971321XXX"
                  className="text-gray-400 hover:text-white transition-colors text-sm">
                  {instansiTelepon}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <a
                  href={`mailto:${instansiEmail}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm">
                  {instansiEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-500 shrink-0" />
                <a
                  href="https://merauke.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm">
                  {appAlias}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-gray-800 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {startYear} - {currentYear} {instansiName}. Hak Cipta Dilindungi.
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
