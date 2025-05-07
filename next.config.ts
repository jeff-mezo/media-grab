import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
  },
};

export default nextConfig;
