import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
  allowedDevOrigins: ['192.168.1.218'],
};

export default nextConfig;

