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
      // Kiosk-internal docker hostname (DOCKER_BACKEND_URL); unreachable from
      // Vercel, kept only so local docker setups keep working.
      { protocol: 'http', hostname: 'backend' },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
