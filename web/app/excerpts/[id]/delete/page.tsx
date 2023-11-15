import { Metadata } from 'next';
import { isNum } from '@/app/common/server';
import { notFound } from 'next/navigation';
import DeleteExcerpt from '@/app/excerpts/[id]/delete/delete';

export const metadata: Metadata = {
  title: 'delete excerpt - infoharvest',
  description: 'delete excerpt page',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!isNum(id)) {
    notFound();
  }

  return <DeleteExcerpt id={parseInt(id)} />;
}
