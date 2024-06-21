'use client';

import type { IExcerpt } from '@/app/interfaces/excerpt';
import type { IHistory } from '@/app/interfaces/history';
import { notFound, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getFormattedTime } from '@/app/common/tool';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import QueryExcerptsAction from '@/app/actions/excerpts/query-excerpts-action';
import { toast } from 'sonner';
import HistoriesAction from '@/app/actions/histories/histories-action';
import IsLoading from '@/app/components/is-loading';
import NoData from '@/app/components/nodata';

export default function Histories() {
  const searchParams = useSearchParams();
  const excerptId = searchParams.get('eid');

  if (typeof excerptId !== 'string') {
    notFound();
  }

  const [excerpt, setExcerpt] = useState<IExcerpt>();
  const [histories, setHistories] = useState<IHistory[]>([]);
  const { data: response, isLoading } = useSWR(
    ['QueryExcerptsAction', `/excerpts/${excerptId}`, excerptId],
    (args) => QueryExcerptsAction({ id: args[2] }),
  );
  const { data: historiesResponse, isLoading: isLoadingHistoriesResponse } =
    useSWR(
      ['HistoriesAction', `/histories?excerptId=${excerptId}`, excerptId],
      (args) => HistoriesAction(args[2]),
    );

  useEffect(() => {
    if (response) {
      if (response.ok) {
        setExcerpt(response.data);
      } else {
        toast.error(response.error.message);
      }
    }
  }, [response]);
  useEffect(() => {
    if (historiesResponse) {
      if (historiesResponse.ok) {
        setHistories(historiesResponse.data);
      } else {
        toast.error(historiesResponse.error.message);
      }
    }
  }, [historiesResponse]);

  if (
    isLoading ||
    isLoadingHistoriesResponse ||
    !response ||
    !historiesResponse
  ) {
    return <IsLoading />;
  }

  if (!excerpt) {
    return <NoData placeholder="Resource not found." />;
  }

  return (
    <div className="grid container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableCaption>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <Link
                    href="/excerpts"
                    className="underline-offset-4 hover:underline text-foreground"
                  >
                    Return
                  </Link>
                </div>
                <div>/</div>
                <div>Histories [Id.{excerpt.id}]</div>
              </div>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Names</TableHead>
                <TableHead>Links</TableHead>
                <TableHead>States</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {histories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <time dateTime={item.createDate}>
                      {getFormattedTime(item.createDate)}
                    </time>
                  </TableCell>
                  <TableCell>{item.collection?.name ?? 'None'}</TableCell>
                  <TableCell>
                    {item.hNames.length > 0 ? (
                      <Alert className="">
                        <Terminal className="h-4 w-4" />
                        <AlertDescription>
                          {item.hNames.map((item, index) => {
                            return <div key={index}>{item}</div>;
                          })}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      'None'
                    )}
                  </TableCell>
                  <TableCell>
                    {item.hLinks.length > 0 ? (
                      <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertDescription>
                          {item.hLinks.map((item, index) => {
                            return (
                              <div key={index}>
                                <Link
                                  rel="noreferrer"
                                  target="_blank"
                                  href={item}
                                  className="underline-offset-4 hover:underline"
                                >
                                  {item}
                                </Link>
                              </div>
                            );
                          })}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      'None'
                    )}
                  </TableCell>
                  <TableCell>
                    {item.hStates.length > 0 ? (
                      <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertDescription>
                          {item.hStates.map((item, index) => {
                            return <Badge key={index}>{item}</Badge>;
                          })}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      'None'
                    )}
                  </TableCell>
                  <TableCell>
                    {item.description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.description,
                        }}
                      ></div>
                    ) : (
                      'None'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter></TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
