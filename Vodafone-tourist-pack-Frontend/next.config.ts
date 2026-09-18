import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the tracing root to this project (a stray lockfile exists higher up).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
