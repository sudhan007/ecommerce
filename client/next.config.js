/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
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
        hostname: "192.168.1.44",
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
        hostname: "t3.ftcdn.net",
      }
    ],
  },
  output: "standalone",
};

module.exports = nextConfig;
