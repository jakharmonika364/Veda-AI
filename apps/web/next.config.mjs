/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@vedaai/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
