import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "merauke.go.id",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Fix hot reload on Windows
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
