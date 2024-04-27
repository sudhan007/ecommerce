/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/admin",
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
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/api/**",

      }
    ],
  },
};

module.exports = nextConfig;
