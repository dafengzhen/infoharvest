import type { Metadata } from 'next';
import Histories from '@/app/excerpts/histories/histories';
import { Suspense } from 'react';
import IsLoading from '@/app/components/is-loading';

export const metadata: Metadata = {
  title: 'Histories',
};

export default async function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <Histories />
    </Suspense>
  );
}
