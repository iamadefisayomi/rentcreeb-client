import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   async redirects() {
    return [
      {
        source: '/dashboard',    
        destination: '/dashboard/account', 
        permanent: true,
      },
      {
        source: '/dashboard/tools',    
        destination: '/dashboard/tools/details', 
        permanent: true,
      },
      {
        source: '/dashboard/settings',    
        destination: '/dashboard/settings/notifications', 
        permanent: true,
      },
      {
        source: '/for-rent/property',    
        destination: '/for-rent', 
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/rent-house-a2c71.appspot.com/**",
      },
      {
        protocol: "https",
        hostname: "rentcreeb.b-cdn.net",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // Increase limit (e.g., 10MB)
    },
    nodeMiddleware: true
  },
};

export default nextConfig