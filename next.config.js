/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unemqgjvxuwbbbgrusxp.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/services/**",
      },
    ],
  },
};

module.exports = nextConfig;
