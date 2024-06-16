import type { Metadata } from 'next';
import Search from '@/app/search/search';

export const metadata: Metadata = {
  title: 'Search',
};

export default async function Page() {
  return <Search />;
}
