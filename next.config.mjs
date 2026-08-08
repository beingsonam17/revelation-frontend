/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'revelationpestcontrol.com',
      },
    ],
  },
};

export default nextConfig;
