import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Optimize for Docker production builds
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;
