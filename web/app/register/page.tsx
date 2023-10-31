import { Metadata } from 'next';
import Register from '@/app/register/register';

export const metadata: Metadata = {
  title: 'register - infoharvest',
  description: 'user register page',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { type?: 'example' };
}) {
  return <Register type={searchParams.type} />;
}
