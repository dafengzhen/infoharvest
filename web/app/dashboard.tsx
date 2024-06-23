'use client';

import { Chart } from 'chart.js/auto';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { checkLoginStatus } from '@/app/common/tool';
import useSWR from 'swr';
import UserProfileAction from '@/app/actions/user-profile-action';
import type { IUser } from '@/app/interfaces/user';
import { clsx } from 'clsx';

Chart.defaults.font = {
  ...Chart.defaults.font,
  size: 14,
};

export default function Dashboard() {
  const { data: response, isLoading } = useSWR(() => {
    if (checkLoginStatus()) {
      return ['UserProfileAction', '/users/profile'];
    }
  }, UserProfileAction);
  const [user, setUser] = useState<IUser>();
  const [wallpaper, setWallpaper] = useState(false);

  useEffect(() => {
    if (response && response.ok) {
      const user = response.data;
      if (user) {
        setUser(user);

        const customizationSettings = user.customizationSettings;
        setWallpaper(
          typeof customizationSettings === 'object' &&
            !!customizationSettings.wallpaper,
        );
      }
    }
  }, [response]);

  return (
    <div className="grid container mx-auto p-4">
      <Card
        className={clsx(
          'border-dashed border-2 rounded-md py-20 text-center',
          wallpaper ? 'bg-transparent border-0' : '',
        )}
      >
        <CardContent>
          <div className="space-y-1">
            <h4
              className={clsx(
                'text-xl font-medium leading-none',
                wallpaper ? 'text-white text-opacity-85' : '',
              )}
            >
              Welcome back
            </h4>
            <p
              className={clsx(
                'py-2 text-muted-foreground',
                wallpaper ? 'text-white text-opacity-65' : '',
              )}
            >
              How to get started quickly? You can choose to create a collection
              or a snippet to record bookmarks. It's that simple.
            </p>
          </div>
          <Separator
            className={clsx('my-4 mb-8', wallpaper ? 'bg-transparent' : '')}
          />
          <div className="flex items-center justify-center space-x-4 gap-y-2 flex-wrap">
            {!user && (
              <>
                <div>
                  <Link
                    href="/login"
                    className={clsx(
                      'underline-offset-4 hover:underline',
                      wallpaper
                        ? 'text-white text-opacity-85 hover:text-opacity-100'
                        : '',
                    )}
                  >
                    Login
                  </Link>
                </div>
                <Separator
                  orientation="vertical"
                  className={clsx(
                    'h-5',
                    wallpaper ? 'bg-white bg-opacity-65' : '',
                  )}
                />
                <div>
                  <Link
                    href="/register"
                    className={clsx(
                      'underline-offset-4 hover:underline',
                      wallpaper
                        ? 'text-white text-opacity-85 hover:text-opacity-100'
                        : '',
                    )}
                  >
                    Register
                  </Link>
                </div>
                <Separator
                  orientation="vertical"
                  className={clsx(
                    'h-5',
                    wallpaper ? 'bg-white bg-opacity-65' : '',
                  )}
                />
              </>
            )}

            <div>
              <Link
                href="/collections"
                className={clsx(
                  'underline-offset-4 hover:underline',
                  wallpaper
                    ? 'text-white text-opacity-85 hover:text-opacity-100'
                    : '',
                )}
              >
                Collections
              </Link>
            </div>
            <Separator
              orientation="vertical"
              className={clsx('h-5', wallpaper ? 'bg-white bg-opacity-65' : '')}
            />
            <div>
              <Link
                href="/excerpts"
                className={clsx(
                  'underline-offset-4 hover:underline',
                  wallpaper
                    ? 'text-white text-opacity-85 hover:text-opacity-100'
                    : '',
                )}
              >
                Excerpts
              </Link>
            </div>
            <Separator
              orientation="vertical"
              className={clsx('h-5', wallpaper ? 'bg-white bg-opacity-65' : '')}
            />
            <div>
              <Link
                rel="noreferrer"
                target="_blank"
                href="https://github.com/dafengzhen/infoharvest"
                className={clsx(
                  'underline-offset-4 hover:underline',
                  wallpaper
                    ? 'text-white text-opacity-85 hover:text-opacity-100'
                    : '',
                )}
              >
                Github
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
