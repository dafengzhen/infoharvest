import '@/styles/globals.scss';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Providers } from '@/app/providers';
import Navbar from '@/app/navbar';
import { Raleway } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { getPublicPath } from '@/app/common/tool';

const publicPath = getPublicPath();

const raleway = Raleway({
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-raleway',
});

export const metadata: Metadata = {
  title: {
    default: 'infoharvest',
    template: `%s | infoharvest`,
  },
  description:
    'infoharvest is a bookmarking tool that enables users to collect and store interesting online content for easy access and management',
  icons: [
    {
      rel: 'icon',
      url: publicPath + '/favicon/favicon.ico',
      type: 'image/x-icon',
      sizes: 'any',
    },
    {
      rel: 'icon',
      url: publicPath + '/favicon/favicon-32x32.png',
      type: 'image/png',
      sizes: '32x32',
    },
    {
      rel: 'apple-touch-icon',
      url: publicPath + '/favicon/apple-touch-icon.png',
      type: 'image/png',
      sizes: '180x180',
    },
  ],
  manifest: publicPath + '/api/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          raleway.className,
          raleway.variable,
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
