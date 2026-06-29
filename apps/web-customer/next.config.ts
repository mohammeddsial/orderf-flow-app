import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: import.meta.dirname + "/../..",
  },
  transpilePackages: ["@multi-restaurant/database"],
}

export default nextConfig
