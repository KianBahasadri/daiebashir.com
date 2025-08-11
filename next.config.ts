import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://vfzt6ck1uofcwzvn.public.blob.vercel-storage.com/**'), new URL('https://im.runware.ai/**')],
  },
};

export default nextConfig;
