'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { type ChangeEvent, useEffect, useState } from 'react';
import { Loader2, Minus, PlusCircle } from 'lucide-react';
import type { ICollection } from '@/app/interfaces/collection';
import CreateCollectionsAction, {
  ICreateCollectionsActionVariables,
} from '@/app/actions/collections/create-collections-action';
import { toast } from 'sonner';
import UpdateCollectionsAction, {
  IUpdateCollectionsActionVariables,
} from '@/app/actions/collections/update-collections-action';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import QueryCollectionsAction from '@/app/actions/collections/query-collections-action';
import IsLoading from '@/app/components/is-loading';

export interface ISubsetItem {
  id: string | number;
  value: string;
  deletionFlag?: boolean;
}

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Collection name cannot be empty.',
  }),
});

export default function CreateCollection() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('id');
  const [collection, setCollection] = useState<ICollection>();
  const isEdit = !!collection;
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });
  const [subsetItems, setSubsetItems] = useState<ISubsetItem[]>([]);
  const [deletedSubset, setDeletedSubset] = useState<number[]>([]);
  const {
    trigger: createCollectionsTrigger,
    isMutating: isMutatingCreateCollectionsTrigger,
  } = useSWRMutation(
    ['CreateCollectionsAction', '/collections'],
    (_, { arg }: { arg: ICreateCollectionsActionVariables }) =>
      CreateCollectionsAction(arg),
  );
  const {
    trigger: updateCollectionsActionTrigger,
    isMutating: isMutatingUpdateCollectionsActionTrigger,
  } = useSWRMutation(
    ['UpdateCollectionsAction', `/collections/${collection?.id}`],
    (_, { arg }: { arg: IUpdateCollectionsActionVariables }) =>
      UpdateCollectionsAction(arg),
  );
  const { data: collectionResponse, isLoading: isLoadingCollectionResponse } =
    useSWR(
      () => {
        if (typeof collectionId === 'string') {
          return [
            'QueryCollectionsAction',
            `/collections/${collectionId}`,
            collectionId,
          ];
        }
      },
      (args) => QueryCollectionsAction({ id: args[2] }),
    );

  useEffect(() => {
    if (collectionResponse) {
      if (collectionResponse.ok) {
        form.setValue('name', collectionResponse.data.name);
        setSubsetItems(
          collectionResponse.data.subset.map((item) => ({
            id: item.id,
            value: item.name,
          })),
        );
        setCollection(collectionResponse.data);
      } else {
        toast.error(collectionResponse.error.message);
      }
    }
  }, [collectionResponse]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const { name } = values;

    let response;
    if (isEdit) {
      const id = collection.id;
      const subset = subsetItems
        .map((item) => ({ id: item.id, name: item.value }))
        .filter((item) => item.name.trim() !== '')
        .map((item) => {
          return typeof item.id === 'number'
            ? {
                id: item.id,
                name: item.name,
              }
            : {
                name: item.name,
              };
        });

      const _deletedSubset: any[] = [];
      deletedSubset.forEach((item) => {
        const find = collection.subset.find((item2) => item === item2.id);
        if (find) {
          _deletedSubset.push({
            id: find.id,
            name: find.name,
            deletionFlag: true,
          });
        }
      });

      response = await updateCollectionsActionTrigger({
        id,
        name,
        subset: [...subset, ..._deletedSubset],
      });
    } else {
      const subsetNames = subsetItems
        .map((item) => item.value.trim())
        .filter((item) => item !== '');

      response = await createCollectionsTrigger({
        name,
        subsetNames,
      });
    }

    if (response.ok) {
      if (isEdit) {
        toast.success(`Update successful`);
      } else {
        toast.success(`Creation successful`);
        router.push('/collections');
      }
    } else {
      toast.error(response.error.message);
    }
  }

  function onChangeSubsetInput(
    item: ISubsetItem,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const find = subsetItems.find((value) => value.id === item.id);
    if (find) {
      find.value = event.target.value;
    }
    setSubsetItems([...subsetItems]);
  }

  function onClickAddSubset() {
    setSubsetItems([...subsetItems, { id: nanoid(), value: '' }]);
  }

  function onClickDelSubset(item: ISubsetItem) {
    setSubsetItems(subsetItems.filter((value) => value.id !== item.id));

    if (typeof item.id === 'number') {
      setDeletedSubset([...deletedSubset, item.id]);
    }
  }

  function onClickReturn() {
    router.back();
  }

  if (isLoadingCollectionResponse) {
    return <IsLoading />;
  }

  return (
    <div className="grid container mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="border-b mx-6 py-6 mb-6 px-0">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {isEdit ? 'Edit Collection' : 'Create Collection'}
                </CardTitle>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClickReturn}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isMutatingCreateCollectionsTrigger ||
                      isMutatingUpdateCollectionsActionTrigger
                    }
                  >
                    {(isMutatingCreateCollectionsTrigger ||
                      isMutatingUpdateCollectionsActionTrigger) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoFocus {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter a collection name,&nbsp;
                      <span className="font-bold">required</span> field.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Subset</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClickAddSubset}
                  >
                    <PlusCircle className="size-4" />
                  </Button>
                </div>

                {subsetItems.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex-grow">
                        <Input
                          autoFocus
                          value={item.value}
                          onChange={(event) => onChangeSubsetInput(item, event)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onClickDelSubset(item)}
                      >
                        <Minus className="size-4" />
                      </Button>
                    </div>
                  );
                })}

                <FormDescription>
                  Please enter a sub-collection name, optional.
                </FormDescription>
              </FormItem>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
