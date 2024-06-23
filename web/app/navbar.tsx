'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserProfileAction from '@/app/actions/user-profile-action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  checkLoginStatus,
  getPublicPath,
  processFirstCharacter,
} from '@/app/common/tool';
import useSWR from 'swr';
import type { IUser } from '@/app/interfaces/user';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

export default function Navbar() {
  const publicPath = getPublicPath();
  const { data: response, isLoading } = useSWR(() => {
    if (checkLoginStatus()) {
      return ['UserProfileAction', '/users/profile'];
    }
  }, UserProfileAction);

  const [user, setUser] = useState<IUser>();
  const [wallpaper, setWallpaper] = useState(false);
  const username = user ? user.username : 'Anonymous';

  useEffect(() => {
    if (response && response.ok) {
      const user = response.data;
      if (user) {
        setUser(user);

        const customizationSettings = user.customizationSettings;
        if (
          typeof customizationSettings === 'object' &&
          customizationSettings.wallpaper
        ) {
          document.body.style.backgroundImage = `url("${customizationSettings.wallpaper}")`;
          document.body.classList.add('wallpaper');
          setWallpaper(true);
        } else {
          document.body.style.backgroundImage = '';
          document.body.classList.remove('wallpaper');
          setWallpaper(false);
        }
      }
    }
  }, [response]);

  return (
    <header
      className={clsx(
        'sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6',
        wallpaper
          ? 'bg-black bg-opacity-20 border-b-transparent'
          : 'bg-background',
      )}
    >
      <nav className="hidden flex-col gap-6 font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
        <Avatar className="rounded-lg">
          <AvatarImage src={`${publicPath}/images/logo.png`} alt="logo" />
          <AvatarFallback>LOGO</AvatarFallback>
        </Avatar>
        <Link
          href="/"
          className={clsx(
            'transition-colors',
            wallpaper
              ? 'text-white text-opacity-85 hover:text-opacity-100'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/collections"
          className={clsx(
            'transition-colors',
            wallpaper
              ? 'text-white text-opacity-85 hover:text-opacity-100'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Collections
        </Link>
        <Link
          href="/excerpts"
          className={clsx(
            'transition-colors',
            wallpaper
              ? 'text-white text-opacity-85 hover:text-opacity-100'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Excerpts
        </Link>
        <Link
          href="/search"
          className={clsx(
            'transition-colors',
            wallpaper
              ? 'text-white text-opacity-85 hover:text-opacity-100'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Search
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className={clsx(wallpaper ? 'bg-black bg-opacity-70 border-r-0' : '')}
        >
          <nav className="grid gap-6 font-medium">
            <Avatar className="rounded-lg">
              <AvatarImage src={`${publicPath}/images/logo.png`} alt="logo" />
              <AvatarFallback>LOGO</AvatarFallback>
            </Avatar>
            <Link
              href="/"
              className={clsx(
                'transition-colors',
                wallpaper
                  ? 'text-white text-opacity-85 hover:text-opacity-100'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/collections"
              className={clsx(
                'transition-colors',
                wallpaper
                  ? 'text-white text-opacity-85 hover:text-opacity-100'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Collections
            </Link>
            <Link
              href="/excerpts"
              className={clsx(
                'transition-colors',
                wallpaper
                  ? 'text-white text-opacity-85 hover:text-opacity-100'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Excerpts
            </Link>
            <Link
              href="/search"
              className={clsx(
                'transition-colors',
                wallpaper
                  ? 'text-white text-opacity-85 hover:text-opacity-100'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Search
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback
                className={clsx(
                  wallpaper
                    ? 'bg-black bg-opacity-20 text-white text-opacity-85 hover:text-opacity-100'
                    : '',
                )}
              >
                {processFirstCharacter(username)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-sky-500">
              {username}
            </DropdownMenuLabel>

            {user ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/logout" className="w-full">
                    Logout
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/login" className="w-full">
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/register" className="w-full">
                    Register
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
