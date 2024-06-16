import type { Metadata } from 'next';
import Register from '@/app/register/register';
import { Suspense } from 'react';
import IsLoading from '@/app/components/is-loading';

export const metadata: Metadata = {
  title: 'Register',
};

export default async function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <Register />;
    </Suspense>
  );
}
