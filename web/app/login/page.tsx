import { Metadata } from 'next';
import Login from '@/app/login/login';

export const metadata: Metadata = {
  title: 'login - infoharvest',
  description: 'user login page',
};

export default async function Page() {
  return <Login />;
}
