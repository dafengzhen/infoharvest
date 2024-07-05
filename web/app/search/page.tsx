import type { Metadata } from 'next';
import Search from '@/app/search/search';
import { Suspense } from 'react';
import IsLoading from '@/app/components/is-loading';

export const metadata: Metadata = {
  title: 'Search',
};

export default async function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <Search />;
    </Suspense>
  );
}
