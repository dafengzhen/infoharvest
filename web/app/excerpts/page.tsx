import { type Metadata } from 'next';
import Excerpts from '@/app/excerpts/excerpts';
import IsLoading from '@/app/components/is-loading';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Excerpts',
};

export default async function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <Excerpts />
    </Suspense>
  );
}
