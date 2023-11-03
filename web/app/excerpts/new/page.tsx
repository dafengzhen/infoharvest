import { Metadata } from 'next';
import SaveExcerpt from '@/app/excerpts/new/new';
import SelectCollectionsAction from '@/app/actions/collections/select-collections-action';
import { isNum } from '@/app/common/server';

export const metadata: Metadata = {
  title: 'create excerpt - infoharvest',
  description: 'create excerpt page',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { cid?: string; csid?: string };
}) {
  const cid = searchParams.cid;
  const csid = searchParams.csid;
  return (
    <SaveExcerpt
      collections={await SelectCollectionsAction()}
      searchParams={{
        cid: cid && isNum(cid) ? parseInt(cid) : undefined,
        csid: csid && isNum(csid) ? parseInt(csid) : undefined,
      }}
    />
  );
}
