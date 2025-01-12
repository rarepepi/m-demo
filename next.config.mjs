import "./env.mjs";

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
    newNextLinkBehavior: true,
    images: {
      allowFutureImage: true,
    },
  },
  images: {
    domains: [
      "cdn.discordapp.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      // Add your own bucket urls here:
      "Maneki-images-bucket.s3.sa-east-1.amazonaws.com",
      "Maneki-images-bucket.s3.amazonaws.com",
      "Maneki-avatars-bucket.s3.sa-east-1.amazonaws.com",
      "Maneki-avatars-bucket.s3.amazonaws.com",
      "Maneki-tag-images-bucket.s3.sa-east-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
