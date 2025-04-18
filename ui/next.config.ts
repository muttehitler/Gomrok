import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  reactStrictMode: true,
  devIndicators: {
    
  },
  experimental: {
  },
  allowedDevOrigins: ['https://cadillac-preserve-satisfy-ma.trycloudflare.com'],
};

export default nextConfig;
