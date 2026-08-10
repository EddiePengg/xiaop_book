import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve large static assets (mp3, jpg) from the books/ directory via public symlink.
  // We copy books -> public/books at build/dev time so files are reachable at /books/<slug>/...
  reactStrictMode: true,
};

export default nextConfig;
