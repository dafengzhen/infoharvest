import Collections from '@/app/collections/collections';
import type { Metadata } from 'next';
import CollectionsAction from '../actions/collections/collections-action';
import type { ICollection } from '@/app/interfaces/collection';

export const metadata: Metadata = {
  title: 'collections - infoharvest',
  description:
    'this is a collection, and by collection, we mean a grouping of articles for classification',
};

export default async function Page() {
  return <Collections data={(await CollectionsAction()) as ICollection[]} />;
}
