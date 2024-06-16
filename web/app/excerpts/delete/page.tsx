import type { Metadata } from 'next';
import DeleteExcerpt from '@/app/excerpts/delete/delete';
import { Suspense } from 'react';
import IsLoading from '@/app/components/is-loading';

export const metadata: Metadata = {
  title: 'Delete Excerpt',
};

export default async function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <DeleteExcerpt />
    </Suspense>
  );
}
