'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Scroll } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import NoData from '@/app/components/nodata';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import ExcerptsAction from '@/app/actions/excerpts/excerpts-action';
import { useEffect, useState } from 'react';
import type { IExcerpt } from '@/app/interfaces/excerpt';
import { toast } from 'sonner';
import IsLoading from '@/app/components/is-loading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { clsx } from 'clsx';
import { TK } from '@/app/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Excerpts() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('cid');
  const excerptId = searchParams.get('id');
  const { data: response, isLoading } = useSWR(
    () => {
      const token = localStorage.getItem(TK);
      if (!!token) {
        return [
          'ExcerptsAction',
          `/excerpts?collectionId=${collectionId}`,
          collectionId,
        ];
      }
    },
    (args) => ExcerptsAction({ collectionId: args[2] }),
  );
  const router = useRouter();
  const [excerpts, setExcerpts] = useState<IExcerpt[]>([]);

  useEffect(() => {
    if (response) {
      if (response.ok) {
        setExcerpts(response.data);
      } else {
        toast.error(response.error.message);
      }
    }
  }, [response]);

  function onClickNoData() {
    const token = localStorage.getItem(TK);
    if (token) {
      router.push('/excerpts/new');
    } else {
      router.push('/login');
    }
  }

  if (isLoading || !response) {
    return <IsLoading />;
  } else if (excerpts.length === 0) {
    return (
      <NoData
        placeholder="Click the button below to create a resource."
        clickFn={onClickNoData}
      />
    );
  }

  return (
    <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-4 xl:grid-cols-7">
      {excerpts.map((item) => {
        return (
          <Card
            key={item.id}
            className={clsx(
              'flex flex-col',
              excerptId === item.id + ''
                ? 'border-sky-500 shadow-sky-500'
                : false,
            )}
          >
            <CardContent className="p-6">
              <div className="grid gap-3">
                <div className="font-bold">Names</div>
                <div className="grid gap-1 text-muted-foreground">
                  {item.names.map((nameItem) => {
                    return <div key={nameItem.id}>{nameItem.name}</div>;
                  })}
                </div>
              </div>

              {item.links.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-bold">Links</div>
                    <div className="grid gap-1 text-muted-foreground break-all">
                      {item.links.map((linkItem) => {
                        return (
                          <div key={linkItem.id}>
                            <Link
                              rel="noreferrer"
                              target="_blank"
                              href={linkItem.link}
                              className="underline-offset-4 hover:underline"
                            >
                              {linkItem.link}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {item.states.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-bold">States</div>
                    <div className="grid gap-1 text-muted-foreground grid-flow-col auto-cols-max">
                      {item.states.map((stateItem) => {
                        return (
                          <Badge key={stateItem.id}>{stateItem.state}</Badge>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {item.collection && (
                <>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-bold">Collection</div>
                    <div className="grid gap-1 text-muted-foreground">
                      <div>
                        <Link
                          href={`/excerpts?cid=${item.collection.id}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {item.collection.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-2">
              <div className="flex items-center justify-between w-full">
                <div>
                  {item.icon && (
                    <Avatar className="h-[28px] w-[28px]">
                      <AvatarImage
                        src={item.icon}
                        alt="Icon"
                        title={item.icon}
                      />
                      <AvatarFallback>Icon</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {item.description && (
                    <Dialog>
                      <DialogTrigger>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          title="Open the description"
                        >
                          <Scroll className="h-3.5 w-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Description</DialogTitle>
                          <DialogDescription>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                            ></div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Link href={`/excerpts/edit?id=${item.id}`} title="Edit">
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Pencil className="h-3.5 w-3.5"></Pencil>
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="top">
                      <DropdownMenuItem>
                        <Link href="/excerpts/new" className="w-full">
                          Create
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href={`/excerpts/edit?id=${item.id}`}
                          className="w-full"
                        >
                          Edit
                        </Link>
                      </DropdownMenuItem>

                      {item.enableHistoryLogging && (
                        <DropdownMenuItem>
                          <Link
                            href={`/excerpts/histories?eid=${item.id}`}
                            className="w-full"
                          >
                            Histories
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          href={`/excerpts/delete?id=${item.id}`}
                          className="w-full"
                        >
                          Delete
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
