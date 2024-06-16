'use client';

import { notFound, useRouter, useSearchParams } from 'next/navigation';
import type { ICollection } from '@/app/interfaces/collection';
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
import DeleteCollectionsAction, {
  type IDeleteCollectionsActionVariables,
} from '@/app/actions/collections/delete-collections-action';
import { Loader2, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import QueryCollectionsAction from '@/app/actions/collections/query-collections-action';
import IsLoading from '@/app/components/is-loading';
import NoData from '@/app/components/nodata';

export default function DeleteCollection() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('id');

  if (typeof collectionId !== 'string') {
    notFound();
  }

  const [collection, setCollection] = useState<ICollection>();
  const router = useRouter();
  const {
    trigger: deleteCollectionsActionTrigger,
    isMutating: isMutatingDeleteCollectionsActionTrigger,
  } = useSWRMutation(
    ['DeleteCollectionsAction', `/collections/${collection?.id}`],
    (_, { arg }: { arg: IDeleteCollectionsActionVariables }) =>
      DeleteCollectionsAction(arg),
  );
  const { data: response, isLoading } = useSWR(
    ['QueryCollectionsAction', `/collections/${collectionId}`, collectionId],
    (args) => QueryCollectionsAction({ id: args[2] }),
  );

  useEffect(() => {
    if (response) {
      if (response.ok) {
        setCollection(response.data);
      } else {
        toast.error(response.error.message);
      }
    }
  }, [response]);

  async function onClickDelete() {
    if (!collection) {
      toast.error('Resource not found');
      return;
    }

    const response = await deleteCollectionsActionTrigger({
      id: collection.id,
    });
    if (response.ok) {
      toast.success(`Deletion successful`);
      router.push('/collections');
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

  if (!collection) {
    return <NoData placeholder="Resource not found." />;
  }

  return (
    <div className="grid container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Delete Collection</CardTitle>
          <CardDescription>
            Are you sure you want to delete this collection? &nbsp;collection?
          </CardDescription>

          <div className="py-4">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle className="text-red-500">Name</AlertTitle>
              <AlertDescription>{collection.name}</AlertDescription>
            </Alert>
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
              disabled={isMutatingDeleteCollectionsActionTrigger}
            >
              {isMutatingDeleteCollectionsActionTrigger && (
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
