/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.PB_HOSTNAME,
        port: "",
        pathname: "/api/files/**",
      },
    ],
  },
};

module.exports = nextConfig;
