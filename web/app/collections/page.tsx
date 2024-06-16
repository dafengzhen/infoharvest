import Collections from '@/app/collections/collections';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import IsLoading from '@/app/components/is-loading';

export const metadata: Metadata = {
  title: 'Collections',
};

export default async function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <Collections />;
    </Suspense>
  );
}
