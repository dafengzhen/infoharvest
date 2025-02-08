import type { Metadata } from 'next';

import Login from '@/app/login';

export const metadata: Metadata = {
  title: 'login',
};

export default function Page() {
  return <Login />;
}
