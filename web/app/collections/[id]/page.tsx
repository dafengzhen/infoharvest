import { Metadata } from 'next';
import { isNum } from '@/app/common/tool';
import { notFound } from 'next/navigation';
import FindOneCollectionsAction from '@/app/actions/collections/find-one-collections-action';
import Excerpts from '@/app/collections/[id]/excerpts';

export const metadata: Metadata = {
  title: 'excerpts - infoharvest',
  description: 'excerpts page',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!isNum(id)) {
    notFound();
  }

  return (
    <Excerpts
      collection={await FindOneCollectionsAction({ id: parseInt(id) })}
    />
  );
}
