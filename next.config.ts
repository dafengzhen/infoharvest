import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  images: { unoptimized: true },
  output: 'export',
  poweredByHeader: false,
  sassOptions: {
    silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import', 'legacy-js-api'],
  },
};

export default nextConfig;
