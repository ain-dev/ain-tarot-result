/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      "192.168.68.57",
      "picsum.photos",
      "5ae7b9223ead1b8df22cc8a8f0bd7579.r2.cloudflarestorage.com",
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
