import type { NextConfig } from "next";
import "./app/env";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
