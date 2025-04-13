import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  reactStrictMode: true,
  devIndicators: {
    
  },
  experimental: {
  },
  allowedDevOrigins: ['https://transmit-combining-partner-hundred.trycloudflare.com/'],
};

export default nextConfig;
