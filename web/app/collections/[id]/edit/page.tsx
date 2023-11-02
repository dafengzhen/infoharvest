import { Metadata } from 'next';
import UpdateCollection from '@/app/collections/[id]/edit/edit';
import { isNum } from '@/app/common/tool';
import { notFound } from 'next/navigation';
import FindOneCollectionsAction from '@/app/actions/collections/find-one-collections-action';

export const metadata: Metadata = {
  title: 'update collection - infoharvest',
  description: 'update collection page',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!isNum(id)) {
    notFound();
  }

  return (
    <UpdateCollection
      collection={await FindOneCollectionsAction({ id: parseInt(id) })}
    />
  );
}
