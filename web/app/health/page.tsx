import { type Metadata } from 'next';
import Health from '@/app/health/health';
import HealthAction from '@/app/actions/health-action';

export const metadata: Metadata = {
  title: 'health - infoharvest',
  description: 'health page',
};

export default async function Page() {
  return <Health data={await HealthAction()} />;
}
