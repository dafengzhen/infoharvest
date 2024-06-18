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
import { processFirstCharacter } from '@/app/common/tool';
import useSWR from 'swr';
import type { IUser } from '@/app/interfaces/user';
import { TK } from '@/app/constants';

export default function Navbar() {
  const publicPath = process.env.NEXT_PUBLIC_PUBLIC_PATH;
  const { data: response, isLoading } = useSWR(() => {
    const item = localStorage.getItem(TK);
    if (!!item) {
      return ['UserProfileAction', '/users/profile'];
    }
  }, UserProfileAction);

  const user: IUser | null | undefined = isLoading
    ? null
    : response?.ok
      ? response.data
      : null;
  const isLogin = !!user;
  const username = isLogin ? user.username : 'Anonymous';

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
        <Avatar className="rounded-lg">
          <AvatarImage src={`${publicPath}/images/logo.png`} alt="logo" />
          <AvatarFallback>LOGO</AvatarFallback>
        </Avatar>
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          href="/collections"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Collections
        </Link>
        <Link
          href="/excerpts"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Excerpts
        </Link>
        <Link
          href="/search"
          className="text-muted-foreground transition-colors hover:text-foreground"
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
        <SheetContent side="left">
          <nav className="grid gap-6 font-medium">
            <Avatar className="rounded-lg">
              <AvatarImage src="/logo.png" alt="logo" />
              <AvatarFallback>LOGO</AvatarFallback>
            </Avatar>
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/collections"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Collections
            </Link>
            <Link
              href="/excerpts"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Excerpts
            </Link>
            <Link
              href="/search"
              className="text-muted-foreground transition-colors hover:text-foreground"
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
              <AvatarFallback>{processFirstCharacter(username)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-sky-500">
              {username}
            </DropdownMenuLabel>

            {isLogin ? (
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
