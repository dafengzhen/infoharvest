'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { FilePenLine, Loader2, Minus, PlusCircle } from 'lucide-react';
import type { IExcerpt } from '@/app/interfaces/excerpt';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ICollection } from '@/app/interfaces/collection';
import dynamic from 'next/dynamic';
import type { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { toast } from 'sonner';
import { getContent } from '@/app/common/editor';
import { Checkbox } from '@/components/ui/checkbox';
import CreateExcerptsAction, {
  type ICreateExcerptsActionVariables,
} from '@/app/actions/excerpts/create-excerpts-action';
import UpdateExcerptsAction, {
  type IUpdateExcerptsActionVariables,
} from '@/app/actions/excerpts/update-excerpts-action';
import useSWR from 'swr';
import QueryExcerptsAction from '@/app/actions/excerpts/query-excerpts-action';
import IsLoading from '@/app/components/is-loading';
import CollectionsAction from '@/app/actions/collections/collections-action';
import useSWRMutation from 'swr/mutation';

const CustomEditor = dynamic(() => import('../../components/editor'), {
  ssr: false,
});

export interface IInputData {
  id: string | number;
  value: string;
}

export interface IInputItem {
  id: number;
  label: 'Names' | 'Links' | 'States';
  description: string;
  data: IInputData[];
}

const FormSchema = z.object({
  cid: z.string().optional(),
  csid: z.string().optional(),
  enableHistoryLogging: z.boolean().optional(),
});

export default function CreateExcerpt() {
  const searchParams = useSearchParams();
  const excerptId = searchParams.get('id');
  const collectionId = searchParams.get('cid');
  const subsetId = searchParams.get('csid');
  const [excerpt, setExcerpt] = useState<IExcerpt>();
  const [collections, setCollections] = useState<ICollection[]>([]);
  const isEdit = !!excerpt;
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cid: '',
      csid: '',
      enableHistoryLogging: false,
    },
  });
  const [inputs, setInputs] = useState<IInputItem[]>([
    {
      id: 1,
      label: 'Names',
      description: 'The name cannot be empty.',
      data: [],
    },
    {
      id: 2,
      label: 'Links',
      description: 'The link can be empty.',
      data: [],
    },
    {
      id: 3,
      label: 'States',
      description: 'The state can be empty.',
      data: [],
    },
  ]);
  const [chosenCollection, setChosenCollection] = useState<string>('');
  const editorRef = useRef<ClassicEditor | null>(null);
  const [editorInitializing, setEditorInitializing] = useState(true);
  const [deletedNames, setDeletedNames] = useState<number[]>([]);
  const [deletedLinks, setDeletedLinks] = useState<number[]>([]);
  const [deletedStates, setDeletedStates] = useState<number[]>([]);
  const [openEditor, setOpenEditor] = useState(false);
  const { data: excerptResponse, isLoading: isLoadingexcerptResponse } = useSWR(
    () => {
      if (typeof excerptId === 'string') {
        return ['QueryExcerptsAction', `/excerpts/${excerptId}`, excerptId];
      }
    },
    (args) => QueryExcerptsAction({ id: args[2] }),
  );
  const { data: collectionsResponse, isLoading: isLoadingCollectionsResponse } =
    useSWR(['CollectionsAction', '/collections'], CollectionsAction);
  const {
    trigger: createExcerptsActionTrigger,
    isMutating: isMutatingCreateExcerptsActionTrigger,
  } = useSWRMutation(
    ['CreateExcerptsAction', `/excerpts`],
    (_, { arg }: { arg: ICreateExcerptsActionVariables }) =>
      CreateExcerptsAction(arg),
  );
  const {
    trigger: updateExcerptsActionTrigger,
    isMutating: isMutatingUpdateExcerptsActionTrigger,
  } = useSWRMutation(
    ['UpdateExcerptsAction', `/excerpts/${excerptId}`],
    (_, { arg }: { arg: IUpdateExcerptsActionVariables }) =>
      UpdateExcerptsAction(arg),
  );

  useEffect(() => {
    if (excerptResponse) {
      if (excerptResponse.ok) {
        form.setValue(
          'enableHistoryLogging',
          excerptResponse.data.enableHistoryLogging,
        );
        setExcerpt(excerptResponse.data);

        const find = inputs.find((item) => item.id === 1);
        if (find) {
          find.data = excerptResponse.data.names.map((item) => ({
            id: item.id,
            value: item.name,
          }));
        }
        const find2 = inputs.find((item) => item.id === 2);
        if (find2) {
          find2.data = excerptResponse.data.links.map((item) => ({
            id: item.id,
            value: item.link,
          }));
        }
        const find3 = inputs.find((item) => item.id === 3);
        if (find3) {
          find3.data = excerptResponse.data.states.map((item) => ({
            id: item.id,
            value: item.state,
          }));
        }

        setInputs([...inputs]);
      } else {
        toast.error(excerptResponse.error.message);
      }
    }
  }, [excerptResponse]);
  useEffect(() => {
    if (collectionsResponse) {
      if (collectionsResponse.ok) {
        setCollections(collectionsResponse.data);
      } else {
        toast.error(collectionsResponse.error.message);
      }
    }
  }, [collectionsResponse]);
  useEffect(() => {
    if (excerpt && collections && collections.length > 0) {
      const _collectionId = excerpt.collection?.id ?? collectionId ?? subsetId;
      const find = collections.find((item) => item.id === _collectionId);
      if (find) {
        const cid = find.id + '';
        form.setValue('cid', cid);
        setChosenCollection(cid);
      } else {
        for (let i = 0; i < collections.length; i++) {
          const item = collections[i];
          const findSubsetItem = item.subset.find(
            (subsetItem) => subsetItem.id === _collectionId,
          );
          if (findSubsetItem) {
            const cid = item.id + '';
            const csid = findSubsetItem.id + '';
            form.setValue('cid', cid);
            form.setValue('csid', csid);
            setChosenCollection(csid);
            break;
          }
        }
      }
    }
  }, [excerpt, collections]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const { cid, csid, enableHistoryLogging } = values;
    const _cid = cid === '-1' ? '' : cid;
    const _csid = csid === '-1' ? '' : csid;
    const collectionId = _csid !== '' ? _csid : _cid;
    const _collectionId = collectionId ? +collectionId : undefined;
    const names = getInputs(1, 'name');
    const links = getInputs(2, 'link');
    const states = getInputs(3, 'state');
    const description = getContent(editorRef);

    if (names.length === 0) {
      toast.error('The name of the excerpt cannot be empty');
      return;
    }

    let response;
    if (isEdit) {
      const id = excerpt.id;
      response = await updateExcerptsActionTrigger({
        id,
        names: getNames(excerpt, names),
        links: getLinks(excerpt, links),
        states: getStates(excerpt, states),
        collectionId: _collectionId,
        description,
        enableHistoryLogging,
        deleteCollection: typeof _collectionId !== 'number',
      });
    } else {
      response = await createExcerptsActionTrigger({
        names: names.map((item) => item.name),
        links: links.map((item) => item.link),
        states: states.map((item) => item.state),
        collectionId: _collectionId,
        description,
        enableHistoryLogging,
      });
    }

    if (response.ok) {
      if (isEdit) {
        toast.success(`Update successful`);
      } else {
        toast.success(`Creation successful`);
        router.push('/excerpts');
      }
    } else {
      toast.error(response.error.message);
    }
  }

  function getNames(excerpt: IExcerpt, names: any[]) {
    const _deletedNames: any[] = [];
    deletedNames.forEach((item) => {
      const find = excerpt.names.find((item2) => item === item2.id);
      if (find) {
        _deletedNames.push({
          id: find.id,
          name: find.name,
          deletionFlag: true,
        });
      }
    });
    return [...names, ..._deletedNames];
  }

  function getLinks(excerpt: IExcerpt, links: any[]) {
    const _deletedLinks: any[] = [];
    deletedLinks.forEach((item) => {
      const find = excerpt.links.find((item2) => item === item2.id)!;
      if (find) {
        _deletedLinks.push({
          id: find.id,
          link: find.link,
          deletionFlag: true,
        });
      }
    });
    return [...links, ..._deletedLinks];
  }

  function getStates(excerpt: IExcerpt, states: any[]) {
    const _deletedStates: any[] = [];
    deletedStates.forEach((item) => {
      const find = excerpt.states.find((item2) => item === item2.id)!;
      if (find) {
        _deletedStates.push({
          id: find.id,
          state: find.state,
          deletionFlag: true,
        });
      }
    });
    return [...states, ..._deletedStates];
  }

  function getInputs(id: number, key: string) {
    let values: any[] = [];
    const items = inputs.find((item) => item.id === id);
    if (items) {
      values = items.data
        .filter((item) => item.value.trim() !== '')
        .map((item) => {
          const value = item.value.trim();
          return typeof item.id === 'number'
            ? {
                id: item.id,
                [key]: value,
              }
            : {
                [key]: value,
              };
        });
    }
    return values;
  }

  function onChangeInput(
    item: IInputItem,
    dataItem: IInputData,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    dataItem.value = event.target.value;
    setInputs([...inputs]);
  }

  function onClickDelInput(item: IInputItem, dataItem: IInputData) {
    const index = item.data.findIndex((value) => value.id === dataItem.id);
    if (index !== -1) {
      item.data.splice(index, 1);
    }
    setInputs([...inputs]);

    if (item.id === 1 && typeof dataItem.id === 'number') {
      setDeletedNames([...deletedNames, dataItem.id]);
    } else if (item.id === 2 && typeof dataItem.id === 'number') {
      setDeletedLinks([...deletedLinks, dataItem.id]);
    } else if (item.id === 3 && typeof dataItem.id === 'number') {
      setDeletedStates([...deletedStates, dataItem.id]);
    }
  }

  function onClickAddInput(item: IInputItem) {
    item.data.push({ id: nanoid(), value: '' });
    setInputs([...inputs]);
  }

  function onClickReturn() {
    router.back();
  }

  function onClickOpenEditor() {
    setOpenEditor(!openEditor);
  }

  if (isLoadingexcerptResponse || isLoadingCollectionsResponse) {
    return <IsLoading />;
  }

  return (
    <div className="grid container mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="border-b mx-6 py-6 mb-6 px-0">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {isEdit ? 'Edit Excerpt' : 'Create Excerpt'}
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
                      isMutatingCreateExcerptsActionTrigger ||
                      isMutatingUpdateExcerptsActionTrigger
                    }
                  >
                    {(isMutatingCreateExcerptsActionTrigger ||
                      isMutatingUpdateExcerptsActionTrigger) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {inputs.map((item) => {
                return (
                  <FormItem key={item.id}>
                    <div className="flex items-center justify-between">
                      <FormLabel>{item.label}</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onClickAddInput(item)}
                      >
                        <PlusCircle className="size-4" />
                      </Button>
                    </div>

                    {item.data.map((dataItem) => {
                      return (
                        <div
                          key={dataItem.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex-grow">
                            <Textarea
                              className="min-h-[40px]"
                              rows={1}
                              autoFocus
                              value={dataItem.value}
                              onChange={(event) =>
                                onChangeInput(item, dataItem, event)
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onClickDelInput(item, dataItem)}
                          >
                            <Minus className="size-4" />
                          </Button>
                        </div>
                      );
                    })}

                    <FormDescription>{item.description}</FormDescription>
                  </FormItem>
                );
              })}

              <FormField
                control={form.control}
                name="cid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setChosenCollection(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[{ id: -1, name: 'None' }, ...collections].map(
                          (item) => {
                            return (
                              <SelectItem
                                key={item.id}
                                value={item.id + ''}
                                className={
                                  item.id === -1 ? 'text-gray-400' : ''
                                }
                              >
                                {item.name}
                              </SelectItem>
                            );
                          },
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {chosenCollection && chosenCollection !== '-1' && (
                <FormField
                  control={form.control}
                  name="csid"
                  render={({ field }) => {
                    const find = collections.find(
                      (item) => item.id + '' === chosenCollection,
                    );
                    const subset = find?.subset ?? [];

                    return (
                      <FormItem>
                        <FormLabel>Subset</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[{ id: -1, name: 'None' }, ...subset].map(
                              (item) => {
                                return (
                                  <SelectItem
                                    key={item.id}
                                    value={item.id + ''}
                                    className={
                                      item.id === -1 ? 'text-gray-400' : ''
                                    }
                                  >
                                    {item.name}
                                  </SelectItem>
                                );
                              },
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}

              <FormField
                control={form.control}
                name="enableHistoryLogging"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>History</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="enableHistoryLogging"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        <label
                          htmlFor="enableHistoryLogging"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Would you like to enable recording and logging of
                          excerpt history?
                        </label>
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Description</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClickOpenEditor}
                  >
                    <FilePenLine className="size-4" />
                  </Button>
                </div>

                {openEditor ? (
                  <>
                    {editorInitializing && (
                      <FormDescription>
                        The editor is loading...
                      </FormDescription>
                    )}

                    <CustomEditor
                      initialData={isEdit ? excerpt.description ?? '' : ''}
                      onReady={(editor: ClassicEditor) => {
                        editorRef.current = editor;
                        setEditorInitializing(false);
                      }}
                      onError={(e: Error) => {
                        setEditorInitializing(false);
                        toast.error(
                          e.message ?? 'Failed to load the editorRef',
                        );
                      }}
                    />
                  </>
                ) : (
                  <FormDescription>
                    Click on the icon to the left of the description to open the
                    editor.
                  </FormDescription>
                )}
              </FormItem>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
