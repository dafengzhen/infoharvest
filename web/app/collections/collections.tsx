'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Plus, Slash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment, useEffect, useState } from 'react';
import NoData from '@/app/components/nodata';
import { useRouter, useSearchParams } from 'next/navigation';
import CollectionsAction from '@/app/actions/collections/collections-action';
import useSWR from 'swr';
import type { ICollection } from '@/app/interfaces/collection';
import { toast } from 'sonner';
import IsLoading from '@/app/components/is-loading';
import { clsx } from 'clsx';
import { checkLoginStatus } from '@/app/common/tool';

export default function Collections() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('id');
  const { data: response, isLoading } = useSWR(() => {
    if (checkLoginStatus()) {
      return ['CollectionsAction', '/collections'];
    }
  }, CollectionsAction);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (response) {
      if (response.ok) {
        setCollections(response.data);
      } else {
        toast.error(response.error.message);
      }
    }
  }, [response]);
  useEffect(() => {
    if (!checkLoginStatus()) {
      router.push('/login');
    }
  }, []);

  function onClickNoData() {
    if (checkLoginStatus()) {
      router.push('/collections/new');
    } else {
      router.push('/login');
    }
  }

  if (isLoading || !response) {
    return <IsLoading />;
  } else if (collections.length === 0) {
    return (
      <NoData
        placeholder="Click the button below to create a resource."
        clickFn={onClickNoData}
      />
    );
  }

  return (
    <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-4 xl:grid-cols-8">
      {[
        ...(collections.length > 0
          ? [
              {
                id: -1,
                subset: [] as ICollection[],
              } as ICollection,
            ]
          : []),
        ...collections,
      ].map((item) => {
        const subsetLength = item.subset.length;

        if (item.id === -1) {
          return <Create key={item.id} />;
        }

        return (
          <Card
            key={item.id}
            className={clsx(
              'flex flex-col',
              collectionId === item.id + ''
                ? 'border-sky-500 shadow-sky-500'
                : false,
            )}
          >
            <CardContent className="p-6 flex items-center justify-center flex-grow">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href={`/excerpts?cid=${item.id}`}
                        className="font-bold underline-offset-4 hover:underline hover:text-sky-300"
                      >
                        {item.name}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {item.subset.length > 0 && (
                    <BreadcrumbSeparator>
                      <Slash />
                    </BreadcrumbSeparator>
                  )}

                  {item.subset.map((subsetItem, subsetIndex) => {
                    return (
                      <Fragment key={subsetItem.id}>
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link
                              href={`/excerpts?cid=${item.id}&csid=${subsetItem.id}`}
                              className="underline-offset-4 hover:underline text-muted-foreground hover:text-sky-200"
                            >
                              {subsetItem.name}
                            </Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>

                        {subsetIndex + 1 !== subsetLength && (
                          <BreadcrumbSeparator>
                            <Slash />
                          </BreadcrumbSeparator>
                        )}
                      </Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-2">
              <div className="flex justify-between w-full">
                <div></div>
                <div className="flex items-center gap-1">
                  <Link href={`/collections/edit?id=${item.id}`} title="Edit">
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
                    <DropdownMenuContent align="start" side="top">
                      <DropdownMenuItem>
                        <Link href="/collections/new" className="w-full">
                          Create
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/excerpts/new" className="w-full">
                          CreateExcerpt
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href={`/collections/edit?id=${item.id}`}
                          className="w-full"
                        >
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          href={`/collections/delete?id=${item.id}`}
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

const Create = () => {
  return (
    <Card className="flex flex-col" title="Create Collection">
      <CardContent className="p-0 flex items-center justify-center flex-grow">
        <Link
          href="/collections/new"
          className="w-full h-full flex items-center justify-center p-6"
        >
          <Plus className="h-10 w-10" />
        </Link>
      </CardContent>
    </Card>
  );
};
