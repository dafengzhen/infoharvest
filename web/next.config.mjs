/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  poweredByHeader: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  trailingSlash: true
};

export default nextConfig;
