import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: { formats: ["image/avif", "image/webp"] },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // CSS crítico inline no HTML: elimina a requisição bloqueante de render.
    inlineCss: true,
  },
};

export default nextConfig;
