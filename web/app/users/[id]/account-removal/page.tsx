import { Metadata } from 'next';
import AccountRemoval from '@/app/users/[id]/account-removal/account-removal';

export const metadata: Metadata = {
  title: 'account removal - infoharvest',
  description: 'user account removal page',
};

export default function Page({ params }: { params: { id: string } }) {
  console.log(params);

  return <AccountRemoval />;
}
