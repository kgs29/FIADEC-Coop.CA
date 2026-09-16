import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-icons", "lucide-react"],
  images: {
    remotePatterns: [
      {
        protocol: 'https' ,
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (process.env.NODE_ENV === "test" || process.env.CYPRESS === "true") {
      config.module.rules.push({
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["next/babel"],
            plugins: ["istanbul"],
            sourceMaps: true,
            retainLines: true,
          },
        },
      });
    }
    return config;
  },
};

export default nextConfig;
