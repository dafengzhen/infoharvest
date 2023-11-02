'use client';

import { useMutation } from '@tanstack/react-query';
import CreateCollectionsAction from '@/app/actions/collections/create-collections-action';
import { ChangeEvent, FormEvent, useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '@/app/contexts';
import SimpleDynamicInput from '@/app/common/simple-dynamic-input';
import Script from 'next/script';

declare const CKSource: any;

export default function CreateExcerpt() {
  const router = useRouter();
  const { toast } = useContext(GlobalContext);
  const [form, setForm] = useState<{
    icon?: string;
    sort?: number;
    enableHistoryLogging?: boolean;
    collectionId?: number;
    description?: string;
  }>({
    icon: '',
    sort: 0,
    enableHistoryLogging: false,
    description: '',
  });
  const [names, setNames] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const editorElement = useRef<HTMLDivElement>(null);
  const [editorInitializing, setEditorInitializing] = useState(true);

  const createCollectionsActionMutation = useMutation({
    mutationFn: CreateCollectionsAction,
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.stopPropagation();
      e.preventDefault();

      // await createCollectionsActionMutation.mutateAsync();

      toast.current.showToast({
        type: 'success',
        message: 'Successfully created a collection',
        duration: 1000,
      });

      setTimeout(() => {
        router.push('/collections');
      }, 1500);
    } catch (e: any) {
      createCollectionsActionMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, create failed'],
      });
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'enableHistoryLogging') {
      setForm({ ...form, enableHistoryLogging: value === 'true' });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function onClickReturn() {
    router.back();
  }

  function onLoadEditor() {
    const current = editorElement.current;
    if (!current) {
      console.error('Editor element node does not exist');
      return;
    }

    if (!CKSource) {
      console.error('Editor initialization failed');
      return;
    }

    const watchdog = new CKSource.EditorWatchdog();
    watchdog.create(current, {}).catch(console.error);
    watchdog.on('error', (error: any) => console.error(error));
    watchdog.setDestructor((editor: any) => editor.destroy());
    watchdog.setCreator((element: any, config: any) =>
      CKSource.Editor.create(element, config).then((editor: any) => {
        return editor;
      }),
    );
    setEditorInitializing(false);
  }

  function onErrorEditor(e: any) {
    console.error(e);
    toast.current.showToast({
      type: 'warning',
      message: [e.message, 'Failed to load the editor'],
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
              <div className="form-control my-3">
                <label className="label flex-col items-start space-y-2 cursor-pointer">
                  <span className="label-text">Record of excerpt history</span>
                  <input
                    type="checkbox"
                    name="enableHistoryLogging"
                    value={form.enableHistoryLogging ? 'true' : 'false'}
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
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
                <label className="label">
                  <span className="label-text-alt">Selection collection</span>
                </label>
              </div>
              <div className="form-control my-3">
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
                <div ref={editorElement}></div>
              </div>
            </div>
            <div className="card-actions mt-4">
              <button
                disabled={
                  createCollectionsActionMutation.isPending ||
                  createCollectionsActionMutation.isSuccess
                }
                type="submit"
                className="btn btn-outline btn-success normal-case"
              >
                {createCollectionsActionMutation.isPending && (
                  <span className="loading loading-spinner"></span>
                )}
                <span>
                  {createCollectionsActionMutation.isPending
                    ? 'Loading'
                    : 'Save'}
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
