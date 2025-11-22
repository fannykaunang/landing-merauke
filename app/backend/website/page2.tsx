"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  X,
  Check,
  AlertCircle,
  Loader2,
  Star,
  StarOff,
  TrendingUp,
  Activity,
  Archive,
  LayoutGrid,
  ChevronDown,
  Calendar,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
interface Website {
  id: number;
  idKategori: number;
  jenisAplikasi: string;
  link: string;
  judul: string;
  deskripsi: string;
  publikasi: string;
  featured: boolean;
  dilihat: number;
  tglInput: string;
  tglUpdate: string;
  image?: {
    id: number;
    namaFile: string;
    lokasiFile: string;
  };
}

interface Category {
  id: number;
  nama: string;
}

// ============================================
// SAMPLE DATA
// ============================================
const sampleCategories: Category[] = [
  { id: 1, nama: "Pemerintahan" },
  { id: 2, nama: "Layanan Publik" },
  { id: 3, nama: "Informasi" },
  { id: 4, nama: "Pendidikan" },
  { id: 5, nama: "Kesehatan" },
];

const sampleWebsites: Website[] = [
  {
    id: 1,
    idKategori: 1,
    jenisAplikasi: "web",
    link: "https://portal.merauke.go.id",
    judul: "Portal Merauke",
    deskripsi: "Portal resmi Pemerintah Kabupaten Merauke",
    publikasi: "ya",
    featured: true,
    dilihat: 15420,
    tglInput: "2024-01-15",
    tglUpdate: "2024-11-20",
    image: {
      id: 1,
      namaFile: "portal.png",
      lokasiFile: "web_gambar/portal.png",
    },
  },
  {
    id: 2,
    idKategori: 2,
    jenisAplikasi: "web",
    link: "https://suara.merauke.go.id",
    judul: "Suara Merauke",
    deskripsi: "Website berita dan informasi Kabupaten Merauke",
    publikasi: "ya",
    featured: true,
    dilihat: 8930,
    tglInput: "2024-02-20",
    tglUpdate: "2024-11-18",
    image: { id: 2, namaFile: "suara.png", lokasiFile: "web_gambar/suara.png" },
  },
  {
    id: 3,
    idKategori: 3,
    jenisAplikasi: "aplikasi",
    link: "https://freehotspot.merauke.go.id",
    judul: "FreeHotspot",
    deskripsi: "Layanan internet gratis untuk masyarakat Merauke",
    publikasi: "ya",
    featured: false,
    dilihat: 5210,
    tglInput: "2024-03-10",
    tglUpdate: "2024-11-15",
    image: {
      id: 3,
      namaFile: "hotspot.png",
      lokasiFile: "web_gambar/hotspot.png",
    },
  },
  {
    id: 4,
    idKategori: 4,
    jenisAplikasi: "web",
    link: "https://disdik.merauke.go.id",
    judul: "Dinas Pendidikan",
    deskripsi: "Website resmi Dinas Pendidikan Kabupaten Merauke",
    publikasi: "tidak",
    featured: false,
    dilihat: 2340,
    tglInput: "2024-04-05",
    tglUpdate: "2024-10-28",
  },
  {
    id: 5,
    idKategori: 5,
    jenisAplikasi: "aplikasi",
    link: "https://rsud.merauke.go.id",
    judul: "RSUD Merauke",
    deskripsi: "Sistem informasi RSUD Kabupaten Merauke",
    publikasi: "ya",
    featured: false,
    dilihat: 7650,
    tglInput: "2024-05-12",
    tglUpdate: "2024-11-10",
    image: { id: 5, namaFile: "rsud.png", lokasiFile: "web_gambar/rsud.png" },
  },
  {
    id: 6,
    idKategori: 1,
    jenisAplikasi: "web",
    link: "https://lpse.merauke.go.id",
    judul: "LPSE Merauke",
    deskripsi: "Layanan Pengadaan Secara Elektronik",
    publikasi: "ya",
    featured: true,
    dilihat: 12890,
    tglInput: "2024-01-08",
    tglUpdate: "2024-11-19",
  },
];

// ============================================
// STAT CARD COMPONENT
// ============================================
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  color: "blue" | "green" | "amber" | "purple" | "rose";
}) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/50",
      icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/50",
    },
    green: {
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/50",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/50",
      icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/50",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/50",
      icon: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
      border: "border-purple-100 dark:border-purple-900/50",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/50",
      icon: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
      border: "border-rose-100 dark:border-rose-900/50",
    },
  };

  const classes = colorClasses[color];

  return (
    <div
      className={`${classes.bg} ${classes.border} border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value.toLocaleString("id-ID")}
          </p>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp
                className={`w-3.5 h-3.5 ${
                  trend === "up"
                    ? "text-emerald-500"
                    : "text-rose-500 rotate-180"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  trend === "up" ? "text-emerald-600" : "text-rose-600"
                }`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`${classes.icon} p-3 rounded-xl`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// MODAL COMPONENT
// ============================================
function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// DELETE CONFIRMATION MODAL
// ============================================
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  websiteName,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  websiteName: string;
  isDeleting: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus" size="sm">
      <div className="p-6">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-900/30">
          <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
        </div>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
          Apakah Anda yakin ingin menghapus website
        </p>
        <p className="text-center font-semibold text-gray-900 dark:text-white mb-6">
          "{websiteName}"?
        </p>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Hapus
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================
// WEBSITE FORM MODAL
// ============================================
function WebsiteFormModal({
  isOpen,
  onClose,
  website,
  categories,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  website?: Website | null;
  categories: Category[];
  onSave: (data: Partial<Website>) => void;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    link: "",
    idKategori: 1,
    jenisAplikasi: "web",
    publikasi: "ya",
    featured: false,
  });

  useEffect(() => {
    if (website) {
      setFormData({
        judul: website.judul,
        deskripsi: website.deskripsi,
        link: website.link,
        idKategori: website.idKategori,
        jenisAplikasi: website.jenisAplikasi,
        publikasi: website.publikasi,
        featured: website.featured,
      });
    } else {
      setFormData({
        judul: "",
        deskripsi: "",
        link: "",
        idKategori: 1,
        jenisAplikasi: "web",
        publikasi: "ya",
        featured: false,
      });
    }
  }, [website, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={website ? "Edit Website" : "Tambah Website Baru"}
      size="lg">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-5">
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Judul Website <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.judul}
                onChange={(e) =>
                  setFormData({ ...formData, judul: e.target.value })
                }
                required
                placeholder="Masukkan judul website"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL / Link <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                required
                placeholder="https://example.merauke.go.id"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) =>
                setFormData({ ...formData, deskripsi: e.target.value })
              }
              required
              rows={3}
              placeholder="Masukkan deskripsi singkat website"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <div className="relative">
                <select
                  value={formData.idKategori}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      idKategori: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Jenis Aplikasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jenis
              </label>
              <div className="relative">
                <select
                  value={formData.jenisAplikasi}
                  onChange={(e) =>
                    setFormData({ ...formData, jenisAplikasi: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                  <option value="web">Website</option>
                  <option value="aplikasi">Aplikasi</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Status & Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Status Publikasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status Publikasi
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, publikasi: "ya" })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.publikasi === "ya"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                  }`}>
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    Aktif
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, publikasi: "tidak" })
                  }
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.publikasi === "tidak"
                      ? "border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400"
                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                  }`}>
                  <div className="flex items-center justify-center gap-2">
                    <X className="w-4 h-4" />
                    Nonaktif
                  </div>
                </button>
              </div>
            </div>

            {/* Featured */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Featured / Unggulan
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, featured: !formData.featured })
                }
                className={`w-full py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  formData.featured
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}>
                <div className="flex items-center justify-center gap-2">
                  {formData.featured ? (
                    <>
                      <Star className="w-4 h-4 fill-amber-500" />
                      Website Unggulan
                    </>
                  ) : (
                    <>
                      <StarOff className="w-4 h-4" />
                      Bukan Unggulan
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gambar / Thumbnail
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Klik untuk upload
                  </span>{" "}
                  atau drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF hingga 2MB
                </p>
              </div>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {website ? "Simpan Perubahan" : "Tambah Website"}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================
// DETAIL MODAL
// ============================================
function DetailModal({
  isOpen,
  onClose,
  website,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  website: Website | null;
  categories: Category[];
}) {
  if (!website) return null;

  const category = categories.find((c) => c.id === website.idKategori);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Website" size="lg">
      <div className="p-6">
        {/* Header Info */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0">
            {website.image ? (
              <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            ) : (
              <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {website.judul}
              </h3>
              {website.featured && (
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
              )}
            </div>
            <a
              href={website.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1">
              {website.link}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Deskripsi
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            {website.deskripsi}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Kategori
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {category?.nama || "-"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Jenis
            </p>
            <p className="font-medium text-gray-900 dark:text-white capitalize">
              {website.jenisAplikasi}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Status
            </p>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${
                website.publikasi === "ya"
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
              }`}>
              {website.publikasi === "ya" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Aktif
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" />
                  Nonaktif
                </>
              )}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Dilihat
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {website.dilihat.toLocaleString("id-ID")} views
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              Dibuat:{" "}
              {new Date(website.tglInput).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              Diperbarui:{" "}
              {new Date(website.tglUpdate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors">
          Tutup
        </button>
      </div>
    </Modal>
  );
}

// ============================================
// MAIN COMPONENT: KELOLA WEBSITES
// ============================================
export default function KelolaWebsites() {
  const [websites, setWebsites] = useState<Website[]>(sampleWebsites);
  const [categories] = useState<Category[]>(sampleCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "ya" | "tidak">(
    "all"
  );
  const [filterFeatured, setFilterFeatured] = useState<"all" | "yes" | "no">(
    "all"
  );

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats
  const stats = {
    total: websites.length,
    active: websites.filter((w) => w.publikasi === "ya").length,
    inactive: websites.filter((w) => w.publikasi === "tidak").length,
    featured: websites.filter((w) => w.featured).length,
    totalViews: websites.reduce((sum, w) => sum + w.dilihat, 0),
  };

  // Filtered websites
  const filteredWebsites = websites.filter((website) => {
    const matchesSearch =
      website.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.link.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || website.idKategori === filterCategory;

    const matchesStatus =
      filterStatus === "all" || website.publikasi === filterStatus;

    const matchesFeatured =
      filterFeatured === "all" ||
      (filterFeatured === "yes" && website.featured) ||
      (filterFeatured === "no" && !website.featured);

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  });

  // Handlers
  const handleAdd = () => {
    setSelectedWebsite(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (website: Website) => {
    setSelectedWebsite(website);
    setIsFormModalOpen(true);
  };

  const handleDetail = (website: Website) => {
    setSelectedWebsite(website);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (website: Website) => {
    setSelectedWebsite(website);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (data: Partial<Website>) => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (selectedWebsite) {
      // Edit existing
      setWebsites((prev) =>
        prev.map((w) =>
          w.id === selectedWebsite.id
            ? { ...w, ...data, tglUpdate: new Date().toISOString() }
            : w
        )
      );
    } else {
      // Add new
      const newWebsite: Website = {
        id: Math.max(...websites.map((w) => w.id)) + 1,
        idKategori: data.idKategori || 1,
        jenisAplikasi: data.jenisAplikasi || "web",
        link: data.link || "",
        judul: data.judul || "",
        deskripsi: data.deskripsi || "",
        publikasi: data.publikasi || "ya",
        featured: data.featured || false,
        dilihat: 0,
        tglInput: new Date().toISOString(),
        tglUpdate: new Date().toISOString(),
      };
      setWebsites((prev) => [newWebsite, ...prev]);
    }

    setIsSaving(false);
    setIsFormModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedWebsite) return;

    setIsDeleting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setWebsites((prev) => prev.filter((w) => w.id !== selectedWebsite.id));
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setSelectedWebsite(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Kelola Websites
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Kelola semua website dan aplikasi yang terdaftar di Portal Merauke
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Website"
            value={stats.total}
            icon={Globe}
            color="blue"
          />
          <StatCard
            title="Aktif"
            value={stats.active}
            icon={Activity}
            trend="up"
            trendValue="+12%"
            color="green"
          />
          <StatCard
            title="Nonaktif"
            value={stats.inactive}
            icon={Archive}
            color="rose"
          />
          <StatCard
            title="Unggulan"
            value={stats.featured}
            icon={Star}
            color="amber"
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            icon={TrendingUp}
            trend="up"
            trendValue="+8%"
            color="purple"
          />
        </div>

        {/* Filters & Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari website..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) =>
                    setFilterCategory(
                      e.target.value === "all"
                        ? "all"
                        : parseInt(e.target.value)
                    )
                  }
                  className="pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-sm">
                  <option value="all">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as "all" | "ya" | "tidak")
                  }
                  className="pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-sm">
                  <option value="all">Semua Status</option>
                  <option value="ya">Aktif</option>
                  <option value="tidak">Nonaktif</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Featured Filter */}
              <div className="relative">
                <select
                  value={filterFeatured}
                  onChange={(e) =>
                    setFilterFeatured(e.target.value as "all" | "yes" | "no")
                  }
                  className="pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-sm">
                  <option value="all">Semua</option>
                  <option value="yes">Unggulan</option>
                  <option value="no">Non-Unggulan</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Add Button */}
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25">
                <Plus className="w-5 h-5" />
                <span>Tambah Website</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header Info */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {filteredWebsites.length}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {websites.length}
              </span>{" "}
              website
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredWebsites.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                          <Globe className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                          Tidak ada website ditemukan
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Coba ubah filter atau kata kunci pencarian
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWebsites.map((website) => {
                    const category = categories.find(
                      (c) => c.id === website.idKategori
                    );
                    return (
                      <tr
                        key={website.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        {/* Website Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0">
                              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                                {website.judul}
                              </p>
                              <a
                                href={website.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] block">
                                {website.link}
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {category?.nama || "-"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              website.publikasi === "ya"
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                            }`}>
                            {website.publikasi === "ya" ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Aktif
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                Nonaktif
                              </>
                            )}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="px-6 py-4">
                          {website.featured ? (
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                          )}
                        </td>

                        {/* Views */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {website.dilihat.toLocaleString("id-ID")}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDetail(website)}
                              className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                              title="Lihat Detail">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(website)}
                              className="p-2 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                              title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(website)}
                              className="p-2 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                              title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <WebsiteFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        website={selectedWebsite}
        categories={categories}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        website={selectedWebsite}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        websiteName={selectedWebsite?.judul || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
