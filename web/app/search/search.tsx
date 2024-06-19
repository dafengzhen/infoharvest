'use client';

import Link from 'next/link';
import SearchCollectionsAction from '@/app/actions/collections/search-collections-action';
import { toast } from 'sonner';
import { type ChangeEvent, useState } from 'react';
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

export default function Search() {
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [excerpts, setExcerpts] = useState<IExcerpt[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const { isLoading } = useSWR(
    ['SearchCollectionsAction', '/search', searchValue],
    (args) => {
      const name = args[2] ?? '';
      if (name === '') {
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
        }
      });
    },
  );

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
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
                      <TableRow key={item.id}>
                        <TableCell>
                          <Link
                            href={`/collections?id=${item.id}`}
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
                      <TableRow key={item.id}>
                        <TableCell>
                          <Link
                            href={`/excerpts?id=${item.id}`}
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