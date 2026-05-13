/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any hostname since we don't know exactly where Appwrite/Shopify images are hosted
      },
    ],
  },
};

export default nextConfig;
