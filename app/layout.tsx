import type { Metadata } from 'next';

import '@/app/styles/globals.scss';
import Providers from '@/app/providers';
import { getPublicPath } from '@/app/tools';
import clsx from 'clsx';
import { Raleway } from 'next/font/google';
import { type ReactNode } from 'react';

const publicPath = getPublicPath();

const raleway = Raleway({
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-raleway',
});

export const metadata: Metadata = {
  description:
    'infoHarvest is a bookmark management tool that helps users collect and store interesting online content for easy access and management',
  icons: [
    {
      rel: 'icon',
      sizes: 'any',
      type: 'image/x-icon',
      url: publicPath + '/favicon/favicon.ico',
    },
    {
      rel: 'icon',
      sizes: '32x32',
      type: 'image/png',
      url: publicPath + '/favicon/favicon-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      type: 'image/png',
      url: publicPath + '/favicon/apple-touch-icon.png',
    },
  ],
  title: {
    default: 'infoharvest',
    template: `%s | infoharvest`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html data-bs-theme="light" lang="en">
      <body className={clsx(raleway.className, raleway.variable, 'bg-body-tertiary')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
