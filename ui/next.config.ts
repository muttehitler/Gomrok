import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  reactStrictMode: true,
  devIndicators: {
    
  },
  experimental: {
  },
  allowedDevOrigins: ['https://localhost:3000','https://192.168.1.136:3000'],
};

export default nextConfig;
