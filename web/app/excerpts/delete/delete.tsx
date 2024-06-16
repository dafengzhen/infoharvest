'use client';

import { notFound, useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Loader2, Terminal } from 'lucide-react';
import type { IExcerpt } from '@/app/interfaces/excerpt';
import DeleteExcerptsAction, {
  type IDeleteExcerptsActionVariables,
} from '@/app/actions/excerpts/delete-excerpts-action';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import QueryExcerptsAction from '@/app/actions/excerpts/query-excerpts-action';
import IsLoading from '@/app/components/is-loading';
import NoData from '@/app/components/nodata';

export default function DeleteExcerpt() {
  const searchParams = useSearchParams();
  const excerptId = searchParams.get('id');

  if (typeof excerptId !== 'string') {
    notFound();
  }

  const [excerpt, setExcerpt] = useState<IExcerpt>();
  const router = useRouter();
  const {
    trigger: deleteExcerptsActionTrigger,
    isMutating: isMutatingDeleteExcerptsActionTrigger,
  } = useSWRMutation(
    ['DeleteExcerptsAction', `/excerpts/${excerpt?.id}`],
    (_, { arg }: { arg: IDeleteExcerptsActionVariables }) =>
      DeleteExcerptsAction(arg),
  );
  const { data: response, isLoading } = useSWR(
    ['QueryExcerptsAction', `/excerpts/${excerptId}`, excerptId],
    (args) => QueryExcerptsAction({ id: args[2] }),
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

  async function onClickDelete() {
    if (!excerpt) {
      toast.error('Resource not found');
      return;
    }

    const response = await deleteExcerptsActionTrigger({ id: excerpt.id });
    if (response.ok) {
      toast.success(`Deletion successful`);
      router.push('/excerpts');
    } else {
      toast.error(response.error.message);
    }
  }

  function onClickReturn() {
    router.back();
  }

  if (isLoading) {
    return <IsLoading />;
  }

  if (!excerpt) {
    return <NoData placeholder="Resource not found." />;
  }

  return (
    <div className="grid container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Delete Excerpt</CardTitle>
          <CardDescription>
            Are you sure you want to delete this excerpt?
          </CardDescription>

          <div className="py-4 space-y-2">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle className="text-red-500">Names</AlertTitle>
              <AlertDescription>
                {excerpt.names.map((item) => {
                  return <div key={item.id}>{item.name}</div>;
                })}
              </AlertDescription>
            </Alert>

            {excerpt.links.length > 0 && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle className="text-red-500">Links</AlertTitle>
                <AlertDescription>
                  {excerpt.links.map((item) => {
                    return (
                      <div key={item.id}>
                        <Link
                          rel="noreferrer"
                          target="_blank"
                          href={item.link}
                          className="underline-offset-4 hover:underline"
                        >
                          {item.link}
                        </Link>
                      </div>
                    );
                  })}
                </AlertDescription>
              </Alert>
            )}

            {excerpt.states.length > 0 && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle className="text-red-500">States</AlertTitle>
                <AlertDescription>
                  {excerpt.states.map((item) => {
                    return <Badge key={item.id}>{item.state}</Badge>;
                  })}
                </AlertDescription>
              </Alert>
            )}

            {excerpt.collection && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle className="text-red-500">Collection</AlertTitle>
                <AlertDescription>{excerpt.collection.name}</AlertDescription>
              </Alert>
            )}
          </div>

          <CardDescription className="font-bold">
            All related data will be permanently deleted and cannot be
            recovered. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onClickReturn}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onClickDelete}
              disabled={isMutatingDeleteExcerptsActionTrigger}
            >
              {isMutatingDeleteExcerptsActionTrigger && (
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
