const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  sw: "sw.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
};

module.exports = withPWA(nextConfig);
