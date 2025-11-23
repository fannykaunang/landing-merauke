// app/backend/website/_client.page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Globe,
  Plus,
  Search,
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
  Activity,
  Archive,
  ChevronDown,
  Calendar,
  Link as LinkIcon,
  FileText,
  Upload,
  RefreshCw,
  Tag,
} from "lucide-react";
import { AuthUser } from "@/lib/types";
import { useRouter } from "next/navigation";

// ============================================
// TYPES
// ============================================
interface Website {
  id: number;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  category_id: number | null;
  tags: string | null;
  featured: number;
  is_active: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Join fields
  category_name: string | null;
  category_slug: string | null;
  category_icon: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  website_count?: number;
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
  featured: number;
}

// ============================================
// STAT CARD COMPONENT
// ============================================
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: "blue" | "green" | "amber" | "purple" | "rose";
  isLoading?: boolean;
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
          {isLoading ? (
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          ) : (
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value.toLocaleString("id-ID")}
            </p>
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
          &quot;{websiteName}&quot;?
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
    title: "",
    description: "",
    url: "",
    image_url: "",
    category_id: 0,
    tags: "",
    featured: false,
    is_active: true,
  });

  useEffect(() => {
    if (website) {
      setFormData({
        title: website.title || "",
        description: website.description || "",
        url: website.url || "",
        image_url: website.image_url || "",
        category_id: website.category_id || 0,
        tags: website.tags || "",
        featured: website.featured === 1,
        is_active: website.is_active === 1,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        url: "",
        image_url: "",
        category_id: categories[0]?.id || 0,
        tags: "",
        featured: false,
        is_active: true,
      });
    }
  }, [website, isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={website ? "Edit Website" : "Tambah Website Baru"}
      size="lg">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Judul Website <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="Masukkan judul website"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL / Link <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required
                placeholder="https://example.merauke.go.id"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Masukkan deskripsi singkat website"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Two columns: Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <div className="relative">
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                  <option value={0}>-- Pilih Kategori --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="portal, pemerintah, layanan"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL Gambar
            </label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="https://example.com/image.png"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Status & Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Status is_active */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: true })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.is_active
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
                  onClick={() => setFormData({ ...formData, is_active: false })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    !formData.is_active
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
}: {
  isOpen: boolean;
  onClose: () => void;
  website: Website | null;
}) {
  if (!website) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Website" size="lg">
      <div className="p-6">
        {/* Header Info */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center shrink-0 overflow-hidden">
            {website.image_url ? (
              <img
                src={website.image_url}
                alt={website.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {website.title}
              </h3>
              {website.featured === 1 && (
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
              )}
            </div>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1">
              {website.url}
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
            {website.description || "-"}
          </p>
        </div>

        {/* Tags */}
        {website.tags && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {website.tags.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Kategori
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {website.category_name || "-"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Status
            </p>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${
                website.is_active === 1
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
              }`}>
              {website.is_active === 1 ? (
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
              Featured
            </p>
            <div className="flex items-center gap-2">
              {website.featured === 1 ? (
                <>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Ya
                  </span>
                </>
              ) : (
                <>
                  <StarOff className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Tidak
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Dibuat Oleh
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {website.created_by || "-"}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              Dibuat:{" "}
              {website.created_at
                ? new Date(website.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              Diperbarui:{" "}
              {website.updated_at
                ? new Date(website.updated_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
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
// SKELETON LOADER
// ============================================
function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function KelolaWebsitesClient() {
  // Data states
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterFeatured, setFilterFeatured] = useState<string>("all");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);

  // Fetch websites
  const fetchWebsites = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (filterCategory !== "all") params.append("category", filterCategory);
      if (filterStatus !== "all") params.append("is_active", filterStatus);
      if (filterFeatured !== "all") params.append("featured", filterFeatured);

      const response = await fetch(`/api/websites?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setWebsites(data.data);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        console.error("Failed to fetch websites:", data.error);
      }
    } catch (error) {
      console.error("Error fetching websites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterCategory, filterStatus, filterFeatured]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();

        if (!data.authenticated) {
          router.push("/login");
          return;
        }

        setUser(data.data.user);
      } catch (error) {
        console.error("Session check error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch websites when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchWebsites();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchWebsites]);

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
    try {
      const method = selectedWebsite ? "PUT" : "POST";
      const body = selectedWebsite ? { id: selectedWebsite.id, ...data } : data;

      const response = await fetch("/api/websites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        setIsFormModalOpen(false);
        fetchWebsites();
      } else {
        alert(result.error || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error saving website:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedWebsite) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/websites?id=${selectedWebsite.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setIsDeleteModalOpen(false);
        setSelectedWebsite(null);
        fetchWebsites();
      } else {
        alert(result.error || "Gagal menghapus data");
      }
    } catch (error) {
      console.error("Error deleting website:", error);
      alert("Terjadi kesalahan saat menghapus data");
    } finally {
      setIsDeleting(false);
    }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Website"
            value={stats.total}
            icon={Globe}
            color="blue"
            isLoading={isLoading}
          />
          <StatCard
            title="Aktif"
            value={stats.active}
            icon={Activity}
            color="green"
            isLoading={isLoading}
          />
          <StatCard
            title="Nonaktif"
            value={stats.inactive}
            icon={Archive}
            color="rose"
            isLoading={isLoading}
          />
          <StatCard
            title="Featured"
            value={stats.featured}
            icon={Star}
            color="amber"
            isLoading={isLoading}
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
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-sm">
                  <option value="all">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-sm">
                  <option value="all">Semua Status</option>
                  <option value="1">Aktif</option>
                  <option value="0">Nonaktif</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Featured Filter */}
              <div className="relative">
                <select
                  value={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.value)}
                  className="pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-sm">
                  <option value="all">Semua</option>
                  <option value="true">Featured</option>
                  <option value="false">Non-Featured</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => fetchWebsites()}
                disabled={isLoading}
                className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Refresh">
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>

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
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5}>
                      <TableSkeleton />
                    </td>
                  </tr>
                ) : websites.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
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
                  websites.map((website) => (
                    <tr
                      key={website.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      {/* Website Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center shrink-0 overflow-hidden">
                            {website.image_url ? (
                              <img
                                src={website.image_url}
                                alt={website.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                              {website.title}
                            </p>
                            <a
                              href={website.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] block">
                              {website.url}
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {website.category_name || "-"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            website.is_active === 1
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                              : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                          }`}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              website.is_active === 1
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {website.is_active === 1 ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="px-6 py-4">
                        {website.featured === 1 ? (
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                        )}
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
                  ))
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
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        websiteName={selectedWebsite?.title || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
