import { Metadata } from 'next';
import { isNum } from '@/app/common/server';
import { notFound } from 'next/navigation';
import FindOneExcerptsAction from '@/app/actions/excerpts/find-one-excerpts-action';
import Histories from '@/app/excerpts/[id]/histories/histories';
import HistoriesAction from '@/app/actions/histories/histories-action';

export const metadata: Metadata = {
  title: 'histories - infoharvest',
  description: 'histories page',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!isNum(id)) {
    notFound();
  }

  const eid = parseInt(id);
  return (
    <Histories
      excerpt={await FindOneExcerptsAction({ id: eid })}
      data={await HistoriesAction(eid)}
    />
  );
}
