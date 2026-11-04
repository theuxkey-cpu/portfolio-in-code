import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/cases/:slug", destination: "/work/:slug", permanent: true },
      // The cases and the profile pages used to open inside the shell; they are pages of their own now.
      { source: "/system/:group(cases|work)/:slug", destination: "/work/:slug", permanent: false },
      { source: "/system/foundations/about", destination: "/about", permanent: false },
      {
        source: "/system/foundations/:slug(experience|skills|education)",
        destination: "/profile/:slug",
        permanent: false,
      },
      { source: "/system", destination: "/about", permanent: false },
    ];
  },
};

export default nextConfig;
