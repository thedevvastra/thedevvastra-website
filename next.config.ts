import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jplqlfzlpwtxqvysgflh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // ✅ FIX: Increase body size limit for large image uploads via Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  // ✅ Build Errors Ignore karne ke liye
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ ESLint Ignore
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
