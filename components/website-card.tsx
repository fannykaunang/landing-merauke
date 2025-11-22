"use client";

import Image from "next/image";
import {
  ExternalLink,
  Star,
  Users,
  Briefcase,
  Code,
  Palette,
  ShoppingCart,
  LayoutGrid,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Website } from "@/lib/types";

interface WebsiteCardProps {
  website: Website;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  users: Users,
  briefcase: Briefcase,
  code: Code,
  palette: Palette,
  "shopping-cart": ShoppingCart,
};

export function WebsiteCard({ website }: WebsiteCardProps) {
  const IconComponent =
    iconMap[website.category_icon || ""] || LayoutGrid;
  const tags = website.tags ? JSON.parse(website.tags) : [];
  const isFeatured = website.featured === 1 || website.featured === true;

  return (
    <Card className="group relative overflow-hidden border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1">
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {website.image_url ? (
          <Image
            src={website.image_url}
            alt={website.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconComponent className="w-16 h-16 text-gray-400 dark:text-gray-600" />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-5">
        {/* Category */}
        {website.category_name && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <IconComponent className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {website.category_name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {website.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
          {website.description || "Tidak ada deskripsi"}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs font-normal bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs font-normal bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300"
          asChild
        >
          <a href={website.url} target="_blank" rel="noopener noreferrer">
            <span>Kunjungi Website</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
