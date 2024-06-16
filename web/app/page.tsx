import Dashboard from '@/app/dashboard';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'infoharvest is a bookmarking tool that enables users to collect and store interesting online content for easy access and management',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { pastDays?: string };
}) {
  return <Dashboard />;
}
