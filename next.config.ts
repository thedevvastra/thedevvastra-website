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
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // ✅ REMOVED the 'eslint' block to fix the Vercel warning
};

export default nextConfig;
