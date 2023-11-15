import { type Metadata } from 'next';
import { isNum } from '@/app/common/server';
import Excerpts from '@/app/excerpts/excerpts';
import FindOneCollectionsAction from '@/app/actions/collections/find-one-collections-action';
import ExcerptsAction from '@/app/actions/excerpts/excerpts-action';
import ExcerptWithoutCollection from '@/app/excerpts/excerpt-without-collection';
import { IExcerpt } from '@/app/interfaces/excerpt';

export const metadata: Metadata = {
  title: 'excerpts - infoharvest',
  description: 'excerpts page',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { cid?: string };
}) {
  const cid = searchParams.cid;
  const _cid = cid && isNum(cid) ? parseInt(cid) : undefined;

  if (typeof _cid === 'number') {
    return (
      <Excerpts
        collection={await FindOneCollectionsAction({ id: _cid })}
        data={(await ExcerptsAction({ collectionId: _cid })) as IExcerpt[]}
      />
    );
  }

  return (
    <ExcerptWithoutCollection data={(await ExcerptsAction()) as IExcerpt[]} />
  );
}
