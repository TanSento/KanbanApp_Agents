import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd(), ".."),
  devIndicators: {
    appDir: false,
  },
};

export default nextConfig;
