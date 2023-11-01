import { type Metadata } from 'next';
import Settings from '@/app/settings/settings';
import UserProfileAction from '@/app/actions/user-profile-action';

export const metadata: Metadata = {
  title: 'settings - infoharvest',
  description: 'user settings page',
};

export default async function Page() {
  return <Settings user={await UserProfileAction()} />;
}
