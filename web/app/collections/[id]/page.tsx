import { type Metadata } from 'next';
import { isNum } from '@/app/common/server';
import { notFound } from 'next/navigation';
import FindOneCollectionsAction from '@/app/actions/collections/find-one-collections-action';
import CollectionId from '@/app/collections/[id]/collectionid';
import ExcerptsAction from '@/app/actions/excerpts/excerpts-action';
import CollectionsAction from '@/app/actions/collections/collections-action';
import { ICollection } from '@/app/interfaces/collection';
import { IExcerpt } from '@/app/interfaces/excerpt';

export const metadata: Metadata = {
  title: 'excerpts - infoharvest',
  description: 'excerpts page',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!isNum(id)) {
    notFound();
  }

  const cid = parseInt(id);
  return (
    <CollectionId
      collection={await FindOneCollectionsAction({ id: cid })}
      collections={(await CollectionsAction()) as ICollection[]}
      data={(await ExcerptsAction({ collectionId: cid })) as IExcerpt[]}
    />
  );
}
