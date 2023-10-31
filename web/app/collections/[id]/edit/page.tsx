'use client';

import DynamicInput, { IDynamicInput } from '@/app/common/dynamic-input';
import { ChangeEvent, useRef, useState } from 'react';
import { nanoid } from 'nanoid';

export default function UpdateCollection() {
  const [subsetItems, setSubsetItems] = useState<IDynamicInput[]>([]);
  const [currentSubsetItem, setCurrentSubsetItem] = useState<IDynamicInput>();
  const dialog = useRef<HTMLDialogElement>(null);

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

    if (currentSubsetItem) {
      setSubsetItems(
        subsetItems.filter((value) => value.id !== currentSubsetItem.id),
      );
    }
  }

  function onClickSubsetAdd() {
    setSubsetItems([
      ...subsetItems,
      {
        id: nanoid(),
        value: '',
        autoFocus: true,
        _dynamic: false,
      },
    ]);
  }

  function onChangeSubsetInput(
    item: IDynamicInput,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setSubsetItems([
      ...subsetItems.filter((value) => value.id !== item.id),
      {
        ...item,
        value: event.target.value,
      },
    ]);
  }

  return (
    <>
      <div className="px-2 py-4 mx-auto">
        <div className="card bg-base-100 border shadow">
          <div className="card-body">
            <h2 className="card-title">Collection</h2>
            <p>update a collection</p>
            <div className="divider"></div>
            <div>
              <div className="form-control my-3">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
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
              <button className="btn btn-outline btn-success normal-case">
                Update
              </button>
            </div>
          </div>
        </div>
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
