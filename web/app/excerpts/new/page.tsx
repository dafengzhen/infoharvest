import { Metadata } from 'next';
import CreateExcerpt from '@/app/excerpts/new/new';

export const metadata: Metadata = {
  title: 'create excerpt - infoharvest',
  description: 'create excerpt page',
};

export default async function Page() {
  return <CreateExcerpt />;
}
