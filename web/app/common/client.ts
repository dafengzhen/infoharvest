'use client';

export const isHttpOrHttps = (value: string) => {
  return value.startsWith('http') || value.startsWith('https');
};
