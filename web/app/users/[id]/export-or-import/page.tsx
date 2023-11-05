import { type Metadata } from 'next';
import ExportOrImport from '@/app/users/[id]/export-or-import/export-or-import';
import { isNum } from '@/app/common/server';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'export or import - infoharvest',
  description: 'export or import page',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!isNum(id)) {
    notFound();
  }

  return <ExportOrImport id={parseInt(id)} />;
}
