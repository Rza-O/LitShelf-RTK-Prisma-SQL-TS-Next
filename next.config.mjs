/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'm.media-amazon.com',
         },
         {
            protocol: 'https',
            hostname: 'images-na.ssl-images-amazon.com',
         },
         {
            protocol: 'https',
            hostname: 'pragprog.com',
         },
         {
            protocol: 'https',
            hostname: '5.imimg.com',
         },
      ],
   },
};

export default nextConfig;
