import Collections from '@/app/collections/collections';
import { Metadata } from 'next';
import CollectionsAction from '../actions/collections/collections-action';

export const metadata: Metadata = {
  title: 'collections - infoharvest',
  description:
    'this is a collection, and by collection, we mean a grouping of articles for classification',
};

export default async function Page() {
  return <Collections data={await CollectionsAction()} />;
}
