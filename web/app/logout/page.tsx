import { Metadata } from 'next';
import Logout from '@/app/logout/logout';

export const metadata: Metadata = {
  title: 'logout - infoharvest',
  description: 'user logout page',
};

export default function Page() {
  return <Logout />;
}
