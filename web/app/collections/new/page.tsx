import { Metadata } from 'next';
import CreateCollection from '@/app/collections/new/new';

export const metadata: Metadata = {
  title: 'create collection - infoharvest',
  description: 'create collection page',
};

export default async function Page() {
  return <CreateCollection />;
}
