/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['@radix-ui/react-icons'],
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig
