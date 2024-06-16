'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TK } from '@/app/constants';

export default function Logout() {
  const router = useRouter();

  function onClickCancel() {
    router.back();
  }

  async function onClickConfirm() {
    toast.info('You will be logged out in two seconds', {
      duration: 1500,
      onAutoClose: () => {
        localStorage.removeItem(TK);
        location.assign('/');
      },
    });
  }

  return (
    <div className="grid container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Logout</CardTitle>
          <CardDescription>Are you sure you want to log out?</CardDescription>
        </CardHeader>
        <CardFooter className="border-t mx-6 px-0 py-6">
          <div className="flex justify-between w-full">
            <Button type="button" variant="outline" onClick={onClickCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onClickConfirm}>
              Confirm
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
