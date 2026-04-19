import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/slimeheim",
  images: { unoptimized: true },
};

export default nextConfig;
