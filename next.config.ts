import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone',
  serverExternalPackages: ["@mastra/*","@anush008/tokenizers"],
};

export default nextConfig;
