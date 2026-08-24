import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/tours",
        destination: "/tour",
        permanent: true,
      },
      {
        source: "/tours/:path*",
        destination: "/tour/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
