import { type MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/register'],
      disallow: [
        '/collections',
        '/collections/*',
        '/exception',
        '/exception/*',
        '/search',
        '/search/*',
        '/settings',
        '/settings/*',
      ],
    },
  };
}
