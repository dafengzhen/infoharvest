import { type Metadata } from 'next';
import Settings from '@/app/settings/settings';

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Page() {
  return <Settings />;
}
