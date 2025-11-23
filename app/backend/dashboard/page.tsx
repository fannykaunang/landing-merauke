// app/backend/dashboard/page.tsx
// ✅ UPDATED - Fetch stats dari database

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  LayoutDashboard,
  Settings,
  Users,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

// ============================================
// TYPES
// ============================================
interface DashboardStats {
  totalWebsites: number;
  totalCategories: number;
  totalUsers: number;
  totalVerifiedUsers: number;
  totalAdminUsers: number;
}

interface WebsiteByCategory {
  category_name: string;
  count: number;
}

interface RecentWebsite {
  id: number;
  title: string;
  url: string;
  created_at: string;
}

// ============================================
// STAT CARD COMPONENT
// ============================================
function StatCard({
  icon: Icon,
  value,
  label,
  color,
  isLoading,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: "blue" | "green" | "amber" | "purple";
  isLoading?: boolean;
}) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      icon: "text-blue-600 dark:text-blue-400",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      icon: "text-green-600 dark:text-green-400",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      icon: "text-amber-600 dark:text-amber-400",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      icon: "text-purple-600 dark:text-purple-400",
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${classes.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${classes.icon}`} />
        </div>
        <div>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value.toLocaleString("id-ID")}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalWebsites: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalVerifiedUsers: 0,
    totalAdminUsers: 0,
  });
  const [websitesByCategory, setWebsitesByCategory] = useState<
    WebsiteByCategory[]
  >([]);
  const [recentWebsites, setRecentWebsites] = useState<RecentWebsite[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();

        if (data.success) {
          setStats(data.data.stats);
          setWebsitesByCategory(data.data.websitesByCategory || []);
          setRecentWebsites(data.data.recentWebsites || []);
        } else {
          console.error("Failed to fetch stats:", data.error);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Selamat Datang, {user?.name || "Pengguna"}! 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Kelola website dan aplikasi Kabupaten Merauke dari dashboard
                ini.
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
              asChild>
              <Link href="/">
                <Globe className="w-4 h-4 mr-2" />
                Lihat Portal
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Globe}
            value={stats.totalWebsites}
            label="Total Website"
            color="blue"
            isLoading={isLoadingStats}
          />
          <StatCard
            icon={LayoutDashboard}
            value={stats.totalCategories}
            label="Kategori"
            color="green"
            isLoading={isLoadingStats}
          />
          <StatCard
            icon={Users}
            value={stats.totalUsers}
            label="Pengguna Aktif"
            color="amber"
            isLoading={isLoadingStats}
          />
        </div>

        {/* Additional Stats Row (Optional) */}
        {stats.totalAdminUsers > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  {isLoadingStats ? (
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalAdminUsers}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  {isLoadingStats ? (
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalVerifiedUsers}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email Terverifikasi
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Websites by Category (Optional) */}
        {websitesByCategory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Website per Kategori
            </h2>
            <div className="space-y-3">
              {websitesByCategory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.category_name}
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {item.count} website
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Menu Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/backend/website"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer block">
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Kelola Website
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tambah, edit, atau hapus website
            </p>
          </Link>

          <Link
            href="/backend/category"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer block">
            <LayoutDashboard className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Kelola Kategori
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Atur kategori website
            </p>
          </Link>

          <Link
            href="/backend/users"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer block">
            <Users className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Kelola Pengguna
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manajemen user dan akses
            </p>
          </Link>

          <Link
            href="/backend/settings"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer block">
            <Settings className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Pengaturan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Konfigurasi sistem
            </p>
          </Link>
        </div>

        {/* Recent Websites (Optional) */}
        {recentWebsites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Website Terbaru
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nama Website
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ditambahkan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentWebsites.map((website) => (
                      <tr
                        key={website.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {website.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400">
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline">
                            {website.url}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(website.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
