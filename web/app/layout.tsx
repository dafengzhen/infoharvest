import type { Metadata } from 'next';
import '../styles/globals.scss';
import React, { ReactNode } from 'react';
import { Providers } from '@/app/providers';
import Navbar from '@/app/navbar';

export const metadata: Metadata = {
  title: 'infoharvest',
  description:
    'infoharvest is a bookmarking tool that enables users to collect and store interesting online content for easy access and management',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html data-theme="light" lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

export const dynamic = 'force-dynamic';
