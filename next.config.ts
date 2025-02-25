import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
    ],
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'png.pngtree.com', 'img.freepik.com', 'drive.google.com', 'static.vecteezy.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
