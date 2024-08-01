/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [
      'picsum.photos',
      '079ef30d9d4760b7b5ee02b920e58155.r2.cloudflarestorage.com',
      '5ae7b9223ead1b8df22cc8a8f0bd7579.r2.cloudflarestorage.com',
      'backend',
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
