import { type Metadata } from 'next';
import { isNum } from '@/app/common/server';
import { notFound } from 'next/navigation';
import FindOneCollectionsAction from '@/app/actions/collections/find-one-collections-action';
import CollectionId from '@/app/collections/[id]/collectionid';
import ExcerptsAction from '@/app/actions/excerpts/excerpts-action';

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
      data={await ExcerptsAction(cid)}
    />
  );
}
