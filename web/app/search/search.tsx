'use client';

import Link from 'next/link';
import SearchCollectionsAction from '@/app/actions/collections/search-collections-action';
import { toast } from 'sonner';
import { type ChangeEvent, type MouseEvent, useEffect, useState } from 'react';
import type { IExcerpt } from '@/app/interfaces/excerpt';
import type { ICollection } from '@/app/interfaces/collection';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useSWR from 'swr';
import { checkLoginStatus } from '@/app/common/tool';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const searchValueParam =
    searchParams.get('k') ??
    searchParams.get('v') ??
    searchParams.get('s') ??
    searchParams.get('q') ??
    '';
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [excerpts, setExcerpts] = useState<IExcerpt[]>([]);
  const [searchValue, setSearchValue] = useState(searchValueParam);
  const router = useRouter();
  const { isLoading } = useSWR(
    ['SearchCollectionsAction', '/search', searchValue],
    (args) => {
      const name = args[2] ?? '';
      if (name === '' || !checkLoginStatus()) {
        return Promise.resolve();
      }

      return SearchCollectionsAction({ name }).then((response) => {
        if (!response.ok) {
          toast.error(response.error.message);
        } else {
          const { collections: _collections, excerpts: _excerpts } =
            response.data;
          setCollections(_collections);
          setExcerpts(_excerpts);
          history.replaceState(null, '', `?v=${name}`);
        }
      });
    },
  );

  useEffect(() => {
    if (!checkLoginStatus()) {
      router.push('/login');
    }
  }, []);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  function onClickRowCollection(
    item: ICollection,
    e: MouseEvent<HTMLTableRowElement | HTMLAnchorElement>,
  ) {
    e.preventDefault();
    e.stopPropagation();

    router.push(`/collections?id=${item.id}`);
  }

  function onClickRowExcerpt(
    item: IExcerpt,
    e: MouseEvent<HTMLTableRowElement | HTMLAnchorElement>,
  ) {
    e.preventDefault();
    e.stopPropagation();

    router.push(`/excerpts?id=${item.id}`);
  }

  return (
    <div className="grid container mx-auto p-4">
      <Card>
        <CardHeader className="border-b mx-6 py-6 mb-6 px-0">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              type="search"
              placeholder="Search collection or excerpt"
              value={searchValue}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-background pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center text-muted-foreground">
              Searching...
            </div>
          ) : (
            <>
              {collections.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Collections</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections.map((item) => (
                      <TableRow
                        key={item.id}
                        onClick={(event) => onClickRowCollection(item, event)}
                      >
                        <TableCell className="cursor-pointer">
                          <Link
                            href=""
                            onClick={(event) =>
                              onClickRowCollection(item, event)
                            }
                            className="underline-offset-4 hover:underline text-muted-foreground"
                          >
                            {item.name}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {excerpts.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Excerpts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {excerpts.map((item) => (
                      <TableRow
                        key={item.id}
                        onClick={(event) => onClickRowExcerpt(item, event)}
                      >
                        <TableCell>
                          <Link
                            href=""
                            onClick={(event) => onClickRowExcerpt(item, event)}
                            className="underline-offset-4 hover:underline text-muted-foreground"
                          >
                            {item.names
                              .map((nameItem) => nameItem.name)
                              .join(' / ')}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {collections.length === 0 && excerpts.length === 0 && (
                <div className="text-center text-muted-foreground">
                  No results found.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
