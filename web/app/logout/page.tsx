import type { Metadata } from 'next';
import Logout from '@/app/logout/logout';

export const metadata: Metadata = {
  title: 'Logout',
};

export default async function Page() {
  return <Logout />;
}
