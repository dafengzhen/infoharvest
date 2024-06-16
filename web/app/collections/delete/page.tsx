import type { Metadata } from 'next';
import DeleteCollection from '@/app/collections/delete/delete';
import { Suspense } from 'react';
import IsLoading from '@/app/components/is-loading';

export const metadata: Metadata = {
  title: 'Delete Collection',
};

export default async function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <DeleteCollection />;
    </Suspense>
  );
}
