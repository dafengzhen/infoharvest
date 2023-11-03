import { Metadata } from 'next';
import AccountRemoval from '@/app/users/[id]/account-removal/account-removal';
import { isNum } from '@/app/common/server';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'account removal - infoharvest',
  description: 'user account removal page',
};

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!isNum(id)) {
    notFound();
  }

  return <AccountRemoval />;
}
