'use client';

import { useMutation } from '@tanstack/react-query';
import {
  type ChangeEvent,
  type FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '@/app/contexts';
import SimpleDynamicInput from '@/app/common/simple-dynamic-input';
import Script from 'next/script';
import { type ISelectCollection } from '@/app/interfaces/collection';
import CreateExcerptsAction, {
  type ICreateExcerptVariables,
} from '@/app/actions/excerpts/create-excerpts-action';
import { isHttpOrHttps } from '@/app/common/client';
import sanitizeHtml from 'sanitize-html';
import { type IExcerpt } from '@/app/interfaces/excerpt';
import UpdateExcerptsAction, {
  IUpdateExcerptVariables,
} from '@/app/actions/excerpts/update-excerpts-action';

declare const CKSource: any;

export default function SaveExcerpt({
  excerpt,
  collections,
  searchParams,
}: {
  excerpt?: IExcerpt;
  collections: ISelectCollection[];
  searchParams: {
    cid?: number;
    csid?: number;
    anchor?: 'states' | 'description';
  };
}) {
  const isUpdate = !!excerpt;
  const router = useRouter();
  const { toast } = useContext(GlobalContext);
  const [form, setForm] = useState<{
    icon?: string;
    sort?: number;
    enableHistoryLogging?: boolean;
    collectionId?: number;
    subsetId?: number;
  }>({
    icon: isUpdate ? excerpt.icon : '',
    sort: isUpdate ? excerpt.sort : 0,
    enableHistoryLogging: isUpdate ? excerpt.enableHistoryLogging : false,
    collectionId: searchParams.cid,
    subsetId: searchParams.csid,
  });
  const [names, setNames] = useState<string[]>(
    isUpdate ? excerpt.names.map((item) => item.name) : [],
  );
  const [links, setLinks] = useState<string[]>(
    isUpdate ? excerpt.links.map((item) => item.link) : [],
  );
  const [states, setStates] = useState<string[]>(
    isUpdate ? excerpt.states.map((item) => item.state) : [],
  );
  const editorElementRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [editorInitializing, setEditorInitializing] = useState(true);
  const [subSet, setSubSet] = useState<ISelectCollection>();
  const stateAdjacentElementRef = useRef<HTMLDivElement>(null);
  const descAdjacentElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isUpdate && excerpt.collection?.id) {
      const id = excerpt.collection.id;
      if (collections.some((item) => item.id === id)) {
        setForm({ ...form, collectionId: id });
      } else {
        for (let i = 0; i < collections.length; i++) {
          const find = collections[i].subset.find((value) => value.id === id);
          if (find) {
            setForm({ ...form, subsetId: id });
            setSubSet(find);
            break;
          }
        }
      }
    }
  }, [excerpt, collections]);
  useEffect(() => {
    const current = editorRef.current;
    if (current && excerpt && excerpt.description?.trim()) {
      setDescription(excerpt.description);
    }
  }, [excerpt, editorRef.current]);
  useEffect(() => {
    const anchor = searchParams.anchor;
    const stateAdjacentElement = stateAdjacentElementRef.current;
    if (anchor === 'states' && stateAdjacentElement) {
      stateAdjacentElement.scrollIntoView();
    }
  }, [stateAdjacentElementRef.current, searchParams.anchor]);
  useEffect(() => {
    const anchor = searchParams.anchor;
    const descAdjacentElement = descAdjacentElementRef.current;
    if (anchor === 'description' && descAdjacentElement) {
      descAdjacentElement.scrollIntoView();
    }
  }, [descAdjacentElementRef.current, searchParams.anchor]);

  const CreateExcerptsActionMutation = useMutation({
    mutationFn: CreateExcerptsAction,
  });
  const UpdateExcerptsActionMutation = useMutation({
    mutationFn: UpdateExcerptsAction,
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.stopPropagation();
      e.preventDefault();

      const _names = names.filter((value) => value !== '');
      const _links = links
        .filter((value) => value !== '' && isHttpOrHttps(value))
        .map((value) =>
          value.endsWith('/') ? value.substring(0, value.length - 1) : value,
        );
      const _states = states.filter((value) => value !== '');

      if (_names.length === 0) {
        toast.current.showToast({
          type: 'warning',
          message: 'The name of the excerpt cannot be empty',
        });
        return;
      }

      const { sort, icon, enableHistoryLogging, collectionId, subsetId } = form;
      let _collectionId: number | undefined;
      if (typeof subsetId === 'number') {
        _collectionId = subsetId;
      } else if (typeof collectionId === 'number') {
        _collectionId = collectionId;
      } else {
        _collectionId = isUpdate ? excerpt.collection?.id : undefined;
      }

      const body: ICreateExcerptVariables | IUpdateExcerptVariables = {
        sort,
        icon: icon && isHttpOrHttps(icon) ? icon : '',
        enableHistoryLogging,
        names: _names,
        links: _links,
        states: _states,
        description: getDescription(),
        collectionId: _collectionId,
      };

      let message;
      if (isUpdate) {
        (body as IUpdateExcerptVariables).id = excerpt.id;
        await UpdateExcerptsActionMutation.mutateAsync(
          body as IUpdateExcerptVariables,
        );
        message = 'Successfully updated a excerpt';
      } else {
        await CreateExcerptsActionMutation.mutateAsync(
          body as ICreateExcerptVariables,
        );
        message = 'Successfully created a excerpt';
      }

      toast.current.showToast({
        type: 'success',
        message,
        duration: 1000,
      });

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (e: any) {
      let message;
      if (isUpdate) {
        UpdateExcerptsActionMutation.reset();
        message = 'Sorry, update failed';
      } else {
        CreateExcerptsActionMutation.reset();
        message = 'Sorry, create failed';
      }

      toast.current.showToast({
        type: 'warning',
        message: [e.message, message],
      });
    }
  }

  function getDescription() {
    const currentEditor = editorRef.current;
    if (!currentEditor) {
      return '';
    }

    const value = currentEditor.getData().trim();
    if (!value) {
      return '';
    }

    return sanitizeHtml(value, {
      allowedTags: false,
      allowedAttributes: false,
      allowVulnerableTags: true,
    });
  }

  function setDescription(description: string) {
    const currentEditor = editorRef.current;
    if (!currentEditor) {
      console.error('Failed to set editor content');
      return;
    }
    currentEditor.setData(description.trim());
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'sort') {
      setForm({ ...form, sort: parseInt(value) });
    } else if (name === 'enableHistoryLogging') {
      setForm({ ...form, enableHistoryLogging: (e.target as any).checked });
    } else if (name === 'collectionId' || name === 'subsetId') {
      setForm({ ...form, [name]: parseInt(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function onClickReturn() {
    router.back();
  }

  function onLoadEditor() {
    const currentElement = editorElementRef.current;
    if (!currentElement) {
      console.error('Editor element node does not exist');
      return;
    }

    if (!CKSource) {
      console.error('Editor initialization failed');
      return;
    }

    const watchdog = new CKSource.EditorWatchdog();
    watchdog.create(currentElement, {}).catch(console.error);
    watchdog.on('error', (error: any) => console.error(error));
    watchdog.setDestructor((editor: any) => editor.destroy());
    watchdog.setCreator((element: any, config: any) =>
      CKSource.Editor.create(element, config).then((editor: any) => {
        editorRef.current = editor;
        return editor;
      }),
    );
    setEditorInitializing(false);
  }

  function onErrorEditor(e: any) {
    console.error(e);
    toast.current.showToast({
      type: 'warning',
      message: [e.message, 'Failed to load the editorRef'],
    });
  }

  return (
    <>
      <div className="px-2 py-4 mx-auto">
        <form className="card bg-base-100 border shadow" onSubmit={onSubmit}>
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title mb-2">Excerpt</h2>
                <p>
                  Craft an excerpt, focusing on valuable and useful information
                  rather than including every detail
                </p>
                <p></p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onClickReturn}
                  className="btn btn-wide normal-case btn-primary"
                >
                  Return
                </button>
              </div>
            </div>
            <div className="divider"></div>
            <div>
              <SimpleDynamicInput
                title="Names"
                label="Please enter a name, it can be multiple, but cannot be empty"
                items={names}
                setItems={setNames}
              />
              <SimpleDynamicInput
                title="Links"
                label="Links can have multiple values or can be empty"
                items={links}
                setItems={setLinks}
                useTextarea={true}
              />
              <SimpleDynamicInput
                title="States"
                label="States can have multiple values or can be empty"
                items={states}
                setItems={setStates}
              />
              {/*<div className="form-control my-3">*/}
              {/*  <label className="label">*/}
              {/*    <span className="label-text">Icon</span>*/}
              {/*  </label>*/}
              {/*  <input*/}
              {/*    type="text"*/}
              {/*    name="icon"*/}
              {/*    value={form.icon}*/}
              {/*    placeholder="icon"*/}
              {/*    className="input input-bordered"*/}
              {/*    onChange={onChange}*/}
              {/*  />*/}
              {/*  <label className="label">*/}
              {/*    <span className="label-text-alt">*/}
              {/*      The icon address of the link can be empty*/}
              {/*    </span>*/}
              {/*  </label>*/}
              {/*</div>*/}
              <div ref={stateAdjacentElementRef} className="form-control my-3">
                <label className="label flex-col items-start space-y-2 cursor-pointer">
                  <span className="label-text">Record of excerpt history</span>
                  <input
                    type="checkbox"
                    name="enableHistoryLogging"
                    checked={form.enableHistoryLogging}
                    value="enableHistoryLogging"
                    className="checkbox"
                    onChange={onChange}
                  />
                </label>
                <label className="label">
                  <span className="label-text-alt">
                    Choose whether to enable recording the historical
                    information of the current excerpt
                  </span>
                </label>
              </div>
              <div className="form-control my-3">
                <label className="label">
                  <span className="label-text">Collection</span>
                </label>
                <select
                  onChange={onChange}
                  name="collectionId"
                  placeholder="collection"
                  className="select select-bordered w-full max-w-xs"
                  value={form.collectionId ? form.collectionId + '' : ''}
                >
                  <option value="">Selection collection</option>
                  {collections.map((item) => {
                    return (
                      <option key={item.id} value={item.id + ''}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              {typeof form.collectionId !== 'undefined' &&
                (
                  collections.find((item) => item.id === form.collectionId) ?? {
                    subset: [],
                  }
                ).subset.length > 0 && (
                  <div className="form-control my-3">
                    <label className="label">
                      <span className="label-text">Subset</span>
                    </label>
                    <select
                      onChange={onChange}
                      name="subsetId"
                      placeholder="subset"
                      className="select select-bordered w-full max-w-xs"
                      value={form.subsetId ? form.subsetId + '' : ''}
                    >
                      <option value="">Selection subset</option>
                      {collections
                        .find((item) => item.id === form.collectionId)!
                        .subset.map((item) => {
                          return (
                            <option key={item.id} value={item.id + ''}>
                              {item.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                )}
              <div ref={descAdjacentElementRef} className="form-control my-3">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <label className="label mb-2">
                  <span className="label-text-alt">
                    Excerpt description, explaining why you added this excerpt.
                    It can also be left blank
                  </span>
                </label>
                {editorInitializing && (
                  <div className="my-2 mx-1 text-zinc-400">
                    Loading the editor...
                  </div>
                )}
                <div ref={editorElementRef}></div>
              </div>
            </div>
            <div className="card-actions mt-4">
              <button
                disabled={
                  CreateExcerptsActionMutation.isPending ||
                  CreateExcerptsActionMutation.isSuccess
                }
                type="submit"
                className="btn btn-outline btn-success normal-case"
              >
                {CreateExcerptsActionMutation.isPending && (
                  <span className="loading loading-spinner"></span>
                )}
                <span>
                  {CreateExcerptsActionMutation.isPending ? 'Loading' : 'Save'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
      <Script
        onReady={onLoadEditor}
        onError={onErrorEditor}
        src="/editor/ckeditor.js"
      />
    </>
  );
}
