import type { Metadata } from 'next';
import CreateCollection from '@/app/collections/new/new';
import { Suspense } from 'react';
import IsLoading from '@/app/components/is-loading';

export const metadata: Metadata = {
  title: 'Create Collection',
};

export default async function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <CreateCollection />;
    </Suspense>
  );
}
