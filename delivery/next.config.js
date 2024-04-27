/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/delivery",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        port: "5000",
      },
      {
        hostname: "65.0.29.203",
        port: "5000",
      },
      {
        hostname: "starexgreen.in",
      }
    ],
  },
};

module.exports = nextConfig;
