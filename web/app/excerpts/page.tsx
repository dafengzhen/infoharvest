import { type Metadata } from 'next';
import { isNum } from '@/app/common/server';
import { notFound } from 'next/navigation';
import Excerpts from '@/app/excerpts/excerpts';
import FindOneCollectionsAction from '@/app/actions/collections/find-one-collections-action';
import ExcerptsAction from '@/app/actions/excerpts/excerpts-action';

export const metadata: Metadata = {
  title: 'excerpts - infoharvest',
  description: 'excerpts page',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { cid: string };
}) {
  const cid = searchParams.cid;
  if (!isNum(cid)) {
    notFound();
  }

  const _cid = parseInt(cid);
  return (
    <Excerpts
      collection={await FindOneCollectionsAction({ id: _cid })}
      data={await ExcerptsAction(_cid)}
    />
  );
}
