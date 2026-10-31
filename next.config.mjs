/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Hosts that card / QR images returned by the result API may live on.
    // `domains` is deprecated; remotePatterns also pins the protocol.
    remotePatterns: [
      // Public R2 bucket the kiosk backend builds card image URLs from
      // (CLOUDFLARE_PUBLIC_URL → https://<host>/card/<set>/<file>).
      {
        protocol: 'https',
        hostname: 'pub-6b9e3c2546424609ba57f6cf0abc16cb.r2.dev',
      },
      // Result API host (NEXT_PUBLIC_API_BASE_URL) static files such as QR images.
      { protocol: 'https', hostname: 'ain-tarot.kr' },
      // Previously allowed hosts, kept for compatibility.
      {
        protocol: 'https',
        hostname: '079ef30d9d4760b7b5ee02b920e58155.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '5ae7b9223ead1b8df22cc8a8f0bd7579.r2.cloudflarestorage.com',
      },
      { protocol: 'https', hostname: 'picsum.photos' },
      // Kiosk-internal docker hostname (DOCKER_BACKEND_URL); unreachable from
      // Vercel, kept only so local docker setups keep working.
      { protocol: 'http', hostname: 'backend' },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
