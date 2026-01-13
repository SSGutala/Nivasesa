import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Skip ESLint during build - monorepo config issue
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
