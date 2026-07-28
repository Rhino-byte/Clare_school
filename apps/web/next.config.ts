import type { NextConfig } from "next";
import path from "path";

const firebaseRoot = path.join(__dirname, "../../node_modules/firebase");

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "firebase/app": path.join(firebaseRoot, "app/dist/esm/index.esm.js"),
      "firebase/auth": path.join(firebaseRoot, "auth/dist/esm/index.esm.js"),
      firebase: firebaseRoot,
    };
    return config;
  },
};

export default nextConfig;
