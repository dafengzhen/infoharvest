import { Metadata } from 'next';
import { isNum } from '@/app/common/tool';
import { notFound } from 'next/navigation';
import FindOneCollectionsAction from '@/app/actions/collections/find-one-collections-action';
import DeleteCollection from '@/app/collections/[id]/delete/delete';

export const metadata: Metadata = {
  title: 'delete collection - infoharvest',
  description: 'delete collection page',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!isNum(id)) {
    notFound();
  }

  return (
    <DeleteCollection
      collection={await FindOneCollectionsAction({ id: parseInt(id) })}
    />
  );
}
