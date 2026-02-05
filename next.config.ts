import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jplqlfzlpwtxqvysgflh.supabase.co", // Aapka Supabase Project URL
        port: "",
        pathname: "/storage/v1/object/public/**", // Sirf public storage allow karein
      },
      // Agar future mein koi aur external images (like Google User Avatar) use karein:
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
