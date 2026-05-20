import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure data files are bundled into serverless function output.
  // posts-cache.json is created by the prebuild script and must be
  // available at runtime; ga_context.txt is the fallback source.
  outputFileTracingIncludes: {
    "/**": ["./src/data/**"],
  },
};

export default nextConfig;
