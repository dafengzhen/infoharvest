import { Metadata } from 'next';
import { isNum } from '@/app/common/server';
import { notFound } from 'next/navigation';
import FindOneExcerptsAction from '@/app/actions/excerpts/find-one-excerpts-action';
import SaveExcerpt from '@/app/excerpts/save';
import SelectCollectionsAction from '@/app/actions/collections/select-collections-action';

export const metadata: Metadata = {
  title: 'update excerpts - infoharvest',
  description: 'update excerpt page',
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    cid?: string;
    csid?: string;
    anchor?: 'states' | 'description';
  };
}) {
  const id = params.id;
  if (!isNum(id)) {
    notFound();
  }

  const cid = searchParams.cid;
  const csid = searchParams.csid;

  return (
    <SaveExcerpt
      excerpt={await FindOneExcerptsAction({ id: parseInt(id) })}
      collections={await SelectCollectionsAction()}
      searchParams={{
        cid: cid && isNum(cid) ? parseInt(cid) : undefined,
        csid: csid && isNum(csid) ? parseInt(csid) : undefined,
        anchor: searchParams.anchor,
      }}
    />
  );
}
