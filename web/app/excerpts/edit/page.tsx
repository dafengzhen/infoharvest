import type { Metadata } from 'next';
import CreateExcerpt from '@/app/excerpts/new/new';
import { Suspense } from 'react';
import IsLoading from '@/app/components/is-loading';

export const metadata: Metadata = {
  title: 'Edit Excerpt',
};

export default async function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <CreateExcerpt />
    </Suspense>
  );
}
