import { Metadata } from 'next';
import Profile from '@/app/profile/profile';
import UserProfileAction from '@/app/actions/user-profile-action';

export const metadata: Metadata = {
  title: 'profile - infoharvest',
  description: 'user profile page',
};

export default async function Page() {
  return <Profile user={await UserProfileAction()} />;
}
