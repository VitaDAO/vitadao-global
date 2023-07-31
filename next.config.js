/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.SUPABASE_ID}.supabase.co`,
        port: "",
        pathname: "/storage/v1/object/public/services/**",
      },
    ],
  },
};

module.exports = nextConfig;
