import { NextResponse } from 'next/server';
import { getPublicPath } from '@/app/common/tool';

export async function GET() {
  const publicPath = getPublicPath();
  return NextResponse.json({
    name: 'infoharvest',
    short_name: 'infoharvest',
    description:
      'infoharvest is a bookmark management tool that enables users to collect and store interesting online content for easy access and management',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: publicPath + '/favicon/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        src: publicPath + '/favicon/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: publicPath + '/favicon/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: publicPath + '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: publicPath + '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  });
}
