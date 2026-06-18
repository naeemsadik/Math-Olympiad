import type { NextConfig } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  // Proxy /api/v1/* to the Laravel backend so the client can call relative paths.
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_BASE.replace(/\/+$/, "")}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
