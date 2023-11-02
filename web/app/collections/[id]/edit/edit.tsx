'use client';

import DynamicInput, { type IDynamicInput } from '@/app/common/dynamic-input';
import {
  type ChangeEvent,
  type FormEvent,
  useContext,
  useRef,
  useState,
} from 'react';
import { nanoid } from 'nanoid';
import { GlobalContext } from '@/app/contexts';
import { useMutation } from '@tanstack/react-query';
import { type ICollection } from '@/app/interfaces/collection';
import UpdateCollectionsAction, {
  type IUpdateCollectionVariables,
} from '@/app/actions/collections/update-collections-action';
import DeleteCollectionsAction from '@/app/actions/collections/delete-collections-action';
import FindOneCollectionsAction from '@/app/actions/collections/find-one-collections-action';
import { useRouter } from 'next/navigation';

export default function UpdateCollection({
  collection,
}: {
  collection: ICollection;
}) {
  const router = useRouter();
  const [subsetItems, setSubsetItems] = useState<IDynamicInput[]>(
    convertSubset(collection),
  );
  const [currentSubsetItem, setCurrentSubsetItem] = useState<IDynamicInput>();
  const dialog = useRef<HTMLDialogElement>(null);
  const { toast } = useContext(GlobalContext);
  const [form, setForm] = useState<{
    name: string;
    sort: number;
  }>({
    name: collection.name,
    sort: collection.sort,
  });

  const updateCollectionsActionMutation = useMutation({
    mutationFn: UpdateCollectionsAction,
  });
  const deleteCollectionsActionMutation = useMutation({
    mutationFn: DeleteCollectionsAction,
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.stopPropagation();
      e.preventDefault();

      const { name, sort } = form;
      const _name = name.trim();
      if (!_name) {
        toast.current.showToast({
          type: 'warning',
          message: 'The name of the collection cannot be empty',
        });
        return;
      }

      const cid = collection.id;
      const body: IUpdateCollectionVariables = {
        id: cid,
        name: _name,
        sort,
        subset: subsetItems
          .filter((item) => !!item.value.trim())
          .map((item) => {
            const id = item.id;
            const value = item.value;
            return item._dynamic ? { name: value } : { id, name: value };
          }) as Partial<Omit<IUpdateCollectionVariables, 'subset'>>[],
      };

      await updateCollectionsActionMutation.mutateAsync(body);

      const _collection = await FindOneCollectionsAction({ id: cid });
      setSubsetItems(convertSubset(_collection));

      toast.current.showToast({
        type: 'success',
        message: 'Successfully updated a collection',
        duration: 1500,
      });
    } catch (e: any) {
      updateCollectionsActionMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, update failed'],
      });
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'sort') {
      setForm({ ...form, sort: parseInt(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function convertSubset(collection: ICollection): IDynamicInput[] {
    return collection.subset.map((item) => {
      return {
        id: item.id,
        value: item.name,
      };
    });
  }

  function onClickSubsetDel(item: IDynamicInput) {
    if (item._dynamic) {
      setSubsetItems(subsetItems.filter((value) => value.id !== item.id));
    } else {
      setCurrentSubsetItem(item);
      dialog.current?.showModal();
    }
  }

  function onConfirmSubsetDel() {
    dialog.current?.close();

    if (currentSubsetItem && typeof currentSubsetItem.id === 'number') {
      const id = currentSubsetItem.id;
      const value = currentSubsetItem.value;
      deleteCollectionsActionMutation
        .mutateAsync({ id })
        .then(() => {
          setSubsetItems(subsetItems.filter((value) => value.id !== id));
          toast.current.showToast({
            type: 'success',
            message: `Removal of subset ${value} successful`,
            duration: 1500,
          });
        })
        .catch((reason: any) => {
          toast.current.showToast({
            type: 'warning',
            message: [
              reason.message,
              `Sorry, failed to remove subset ${value}`,
              'Please refresh the page to view the latest status',
            ],
          });
        });
    }
  }

  function onClickSubsetAdd() {
    setSubsetItems([
      ...subsetItems,
      {
        id: nanoid(),
        value: '',
        autoFocus: true,
        _dynamic: true,
      },
    ]);
  }

  function onChangeSubsetInput(
    item: IDynamicInput,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const find = subsetItems.find((value) => value.id === item.id);
    if (find) {
      find.value = event.target.value;
    }
    setSubsetItems([...subsetItems]);
  }

  function onClickReturn() {
    router.back();
  }

  return (
    <>
      <div className="px-2 py-4 mx-auto">
        <form className="card bg-base-100 border shadow" onSubmit={onSubmit}>
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title mb-2">Collection</h2>
                <p>update a collection</p>
              </div>
              <div>
                <button
                  onClick={onClickReturn}
                  type="button"
                  className="btn btn-wide normal-case btn-primary"
                >
                  Return
                </button>
              </div>
            </div>
            <div className="divider"></div>
            <div>
              <div className="form-control my-3">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="name"
                  className="input input-bordered"
                />
                <label className="label">
                  <span className="label-text-alt">
                    Please enter the name of the collection
                  </span>
                </label>
              </div>
              <div className="form-control my-3">
                <label className="label">
                  <span className="label-text">Sort</span>
                </label>
                <input
                  min={0}
                  type="number"
                  name="sort"
                  value={form.sort + ''}
                  onChange={onChange}
                  placeholder="sort"
                  className="input input-bordered"
                />
                <label className="label">
                  <span className="label-text-alt">
                    Please enter the sorting value
                  </span>
                </label>
              </div>
              <DynamicInput
                title="Subset"
                label="Support creating multiple subsets"
                items={subsetItems}
                onDel={onClickSubsetDel}
                onAdd={onClickSubsetAdd}
                onChangeInput={onChangeSubsetInput}
              />
            </div>
            <div className="card-actions mt-4">
              <button
                type="submit"
                disabled={updateCollectionsActionMutation.isPending}
                className="btn btn-outline btn-success normal-case"
              >
                {updateCollectionsActionMutation.isPending && (
                  <span className="loading loading-spinner"></span>
                )}
                <span>
                  {updateCollectionsActionMutation.isPending
                    ? 'Loading'
                    : 'Update'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
      <dialog ref={dialog} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="flex space-x-2 justify-end">
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
            <div className="modal-action">
              <button onClick={onConfirmSubsetDel} className="btn btn-error">
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
