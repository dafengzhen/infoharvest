import { type Metadata } from 'next';
import Bookmarks from '@/app/bookmarks/bookmarks';

export const metadata: Metadata = {
  title: 'bookmarks - infoharvest',
  description: 'bookmarks page',
};

export default async function Page() {
  return <Bookmarks />;
}
