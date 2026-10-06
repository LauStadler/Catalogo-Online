import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
  allowedDevOrigins: [
    '192.168.1.208',
    '192.168.1.218',
    '*.trycloudflare.com',
    '*.loca.lt',
  ],
};

export default nextConfig;

