import type { Metadata } from 'next';
import '../styles/globals.scss';
import React from 'react';
import { Providers } from '@/app/providers';
import Navbar from '@/app/navbar';

export const metadata: Metadata = {
  title: 'infoharvest',
  description:
    'infoharvest is a bookmarking tool that enables users to collect and store interesting online content for easy access and management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
