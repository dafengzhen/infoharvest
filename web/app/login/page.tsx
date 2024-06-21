import type { Metadata } from 'next';
import Login from '@/app/login/login';
import { Suspense } from 'react';
import IsLoading from '@/app/components/is-loading';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <Login />
    </Suspense>
  );
}
