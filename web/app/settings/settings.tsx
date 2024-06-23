'use client';

import { type IUser } from '@/app/interfaces/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import UpdateUserAction, {
  type IUpdateUserActionVariables,
} from '@/app/actions/update-user-action';
import AccountRemovalAction from '@/app/actions/account-removal-action';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import useSWR from 'swr';
import UserProfileAction from '@/app/actions/user-profile-action';
import useSWRMutation from 'swr/mutation';
import { TK } from '@/app/constants';
import { checkLoginStatus, getPublicPath } from '@/app/common/tool';
import UpdateCustomizationSettingsUserAction, {
  type IUpdateCustomizationSettingsUserActionVariables,
} from '@/app/actions/update-customization-settings-user-action';
import IsLoading from '@/app/components/is-loading';
import { useRouter } from 'next/navigation';

const publicPath = getPublicPath();

const FormSchema = z.object({
  username: z.string().min(1, {
    message: 'Username cannot be empty.',
  }),
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export default function Settings() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      oldPassword: '',
      newPassword: '',
    },
  });
  const { data: userResponse, isLoading } = useSWR(() => {
    if (checkLoginStatus()) {
      return ['UserProfileAction', '/users/profile'];
    }
  }, UserProfileAction);
  const user: IUser | null | undefined = userResponse?.ok
    ? userResponse.data
    : null;
  const { setTheme } = useTheme();
  const [wallpaper, setWallpaper] = useState('');
  const {
    trigger: updateUserTrigger,
    isMutating: isMutatingUpdateUserTrigger,
  } = useSWRMutation(
    ['UpdateUserAction', `/users/${user?.id}`],
    (_, { arg }: { arg: IUpdateUserActionVariables }) => UpdateUserAction(arg),
  );
  const {
    trigger: accountRemovalTrigger,
    isMutating: isMutatingAccountRemovalTrigger,
  } = useSWRMutation(['AccountRemovalAction', '/users'], AccountRemovalAction);
  const {
    trigger: updateCustomizationSettingsUserActionTrigger,
    isMutating: isMutatingUpdateCustomizationSettingsUserActionTrigger,
  } = useSWRMutation(
    [
      'UpdateCustomizationSettingsUserAction',
      `/users/${user?.id}/customization-settings`,
    ],
    (_, { arg }: { arg: IUpdateCustomizationSettingsUserActionVariables }) =>
      UpdateCustomizationSettingsUserAction(arg),
  );

  useEffect(() => {
    if (userResponse && userResponse.ok && userResponse.data) {
      form.setValue('username', userResponse.data.username);

      const customizationSettings =
        userResponse.data.customizationSettings ?? {};
      setWallpaper(customizationSettings.wallpaper ?? '');
    }
  }, [userResponse]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const { username, oldPassword, newPassword } = values;

    if (
      (oldPassword !== '' && newPassword === '') ||
      (oldPassword === '' && newPassword !== '')
    ) {
      toast.error(
        'To update the password, you need to enter the old password and the new password',
      );
      return;
    }

    const response = await updateUserTrigger({
      username,
      oldPassword,
      newPassword,
    });

    if (response.ok) {
      toast.success(`Update successful`);
    } else {
      toast.error(response.error.message);
    }
  }

  async function onClickRemove() {
    const response = await accountRemovalTrigger();
    if (response.ok) {
      toast.success(
        `Account deletion successful. The page will refresh in 2 seconds`,
        {
          duration: 1500,
          onAutoClose: () => {
            localStorage.removeItem(TK);
            location.assign(publicPath + '/');
          },
        },
      );
    } else {
      toast.error(response.error.message);
    }
  }

  async function onClickUpdateCustomizationSettings() {
    const _wallpaper = wallpaper.trim();
    const response = await updateCustomizationSettingsUserActionTrigger({
      wallpaper: _wallpaper,
    });

    if (response.ok) {
      toast.success(`Update successful`);
    } else {
      toast.error(response.error.message);
    }
  }

  function onClickCancel() {
    router.back();
  }

  if (isLoading || !userResponse) {
    return <IsLoading />;
  }

  return (
    <div className="grid container mx-auto p-4 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OldPassword</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NewPassword</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t mx-6 px-0 py-6">
              <div className="flex justify-between w-full">
                <Button onClick={onClickCancel} type="button" variant="outline">
                  Cancel
                </Button>

                <Button type="submit" disabled={isMutatingUpdateUserTrigger}>
                  {isMutatingUpdateUserTrigger && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <Card>
        <CardHeader>
          <CardTitle>Wallpaper</CardTitle>
          <CardDescription>
            Set home screen wallpaper, recommended size is 4534 x 3022. Default
            built-in image path is&nbsp;
            <span>{getPublicPath() + '/images/wallpaper.jpg'}</span>
            <span className="select-none">.</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            autoFocus
            placeholder="Supports setting relative paths or links with http and https."
            value={wallpaper}
            onChange={(event) => setWallpaper(event.target.value)}
          />
        </CardContent>
        <CardFooter className="border-t mx-6 px-0 py-6">
          <div className="flex justify-between w-full">
            <Button onClick={onClickCancel} type="button" variant="outline">
              Cancel
            </Button>

            <Button
              onClick={onClickUpdateCustomizationSettings}
              type="button"
              disabled={isMutatingUpdateCustomizationSettingsUserActionTrigger}
            >
              {isMutatingUpdateCustomizationSettingsUserActionTrigger && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Dark mode</CardTitle>
          <CardDescription>Change the page's dark mode.</CardDescription>
        </CardHeader>
        <CardFooter className="border-t mx-6 px-0 py-6">
          <div className="flex justify-between w-full">
            <Button onClick={onClickCancel} type="button" variant="outline">
              Cancel
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button">Toggle</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme('light')}
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme('system')}
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account deactivation</CardTitle>
          <CardDescription>
            Once the account is deactivated, the data will be permanently
            deleted and cannot be recovered.
          </CardDescription>
          <CardDescription className="font-bold">
            Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t mx-6 px-0 py-6">
          <div className="flex justify-between w-full">
            <Button onClick={onClickCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onClickRemove}
              disabled={isMutatingAccountRemovalTrigger}
            >
              {isMutatingAccountRemovalTrigger && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
