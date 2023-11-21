'use client';

import { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { type ICollection } from '@/app/interfaces/collection';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchExcerptsAction from '@/app/actions/excerpts/search-excerpts-action';
import { type IExcerpt } from '@/app/interfaces/excerpt';
import ExcerptsAction from '@/app/actions/excerpts/excerpts-action';
import { getFormattedTime } from '@/app/common/client';
import clsx from 'clsx';
import DeleteExcerptsAction from '@/app/actions/excerpts/delete-excerpts-action';

export default function Excerpts({
  collection,
  data,
}: {
  collection?: ICollection;
  data: IExcerpt[];
}) {
  const router = useRouter();
  const { toast } = useContext(GlobalContext);
  const [search, setSearch] = useState('');
  const [content, setContent] = useState<IExcerpt[]>(data);
  const [clickNameLayout, setClickNameLayout] = useState(false);
  const [clickLinkLayout, setClickLinkLayout] = useState(false);
  const [clickStateLayout, setClickStateLayout] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [clickedExcerptItem, setClickedExcerptItem] = useState<IExcerpt>();
  const [selectAll, setSelectAll] = useState(false);
  const [turnOnSelectDelete, setTurnOnSelectDelete] = useState(false);
  const [batchDeletionInProgress, setBatchDeletionInProgress] = useState(false);

  const excerptsQuery = useQuery({
    queryKey: ['/excerpts'],
    queryFn: async () => {
      return (await ExcerptsAction({
        collectionId: collection?.id,
      })) as IExcerpt[];
    },
    initialData: data,
  });

  const searchExcerptsActionMutation = useMutation({
    mutationFn: SearchExcerptsAction,
  });
  const deleteExcerptsActionMutation = useMutation({
    mutationFn: DeleteExcerptsAction,
  });

  useEffect(() => {
    setContent([
      ...content.map((item) => {
        item._checked = selectAll;
        return item;
      }),
    ]);
  }, [selectAll]);
  useEffect(() => {
    if (excerptsQuery.data) {
      setContent(excerptsQuery.data);
    }
  }, [excerptsQuery.data]);
  useEffect(() => {
    const name = search.trim();
    if (name) {
      searchExcerptsActionMutation
        .mutateAsync({ name })
        .then(setContent)
        .catch((e) => {
          searchExcerptsActionMutation.reset();
          toast.current.showToast({
            type: 'warning',
            message: [e.message, 'Sorry, search failed'],
          });
        });
    } else {
      setContent(data);
    }
  }, [search]);

  function onClickNameLayout() {
    setClickNameLayout(!clickNameLayout);
  }

  function onClickLinkLayout() {
    setClickLinkLayout(!clickLinkLayout);
  }

  function onClickStateLayout() {
    setClickStateLayout(!clickStateLayout);
  }

  function onClickNameItem(item: IExcerpt) {
    setClickedExcerptItem(item);
    const current = dialog.current;
    if (current) {
      current.showModal();
    } else {
      toast.current.showToast({
        type: 'warning',
        message: 'Dialog element does not exist',
        duration: 1500,
      });
      router.push(`/excerpts/${item.id}/edit`);
    }
  }

  function onClickDetails() {
    dialog.current?.close();
    setClickedExcerptItem(undefined);
  }

  async function onClickBatchDelete(e: MouseEvent<HTMLAnchorElement>) {
    if (batchDeletionInProgress) {
      toast.current.showToast({
        type: 'warning',
        message: 'Deleting in batches',
      });
      return;
    }

    if (!turnOnSelectDelete) {
      setTurnOnSelectDelete(true);
      toast.current.showToast({
        type: 'info',
        message: 'Please select a excerpt to delete',
      });
      return;
    }

    const filter = content.filter((value) => value._checked);
    if (filter.length === 0) {
      toast.current.showToast({
        type: 'warning',
        message: 'No excerpt selected for deletion',
      });
      return;
    }

    try {
      e.stopPropagation();
      e.preventDefault();

      setBatchDeletionInProgress(true);

      for (let i = 0; i < filter.length; i++) {
        const value = filter[i];
        await deleteExcerptsActionMutation.mutateAsync({
          id: value.id,
        });
      }

      await excerptsQuery.refetch({ throwOnError: true });
      setTurnOnSelectDelete(false);
      setSelectAll(false);

      toast.current.showToast({
        type: 'success',
        message: 'The batch deletion is successful',
        duration: 1500,
      });
    } catch (e: any) {
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, batch delete failed'],
      });
    } finally {
      setBatchDeletionInProgress(false);
    }
  }

  function onClickCloseSelectDelete() {
    if (batchDeletionInProgress) {
      toast.current.showToast({
        type: 'warning',
        message: 'Deleting in batches',
      });
      return;
    }

    setSelectAll(false);
    setTurnOnSelectDelete(false);
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div className="w-1/4">
            <div className="form-control">
              <input
                type="text"
                name="search"
                value={search}
                placeholder="Search"
                className="input input-bordered"
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="grow text-end">
            <Link
              href={
                collection
                  ? collection.parentSubset
                    ? `/excerpts/new?cid=${collection.parentSubset.id}&csid=${collection.id}`
                    : `/excerpts/new?cid=${collection.id}`
                  : '/excerpts/new'
              }
              className="btn btn-wide normal-case btn-primary"
            >
              New Excerpt
            </Link>
          </div>
        </div>
        <div className="my-4">
          <table className="table">
            <thead>
              <tr className="">
                {turnOnSelectDelete && (
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-error"
                      name="selectAll"
                      checked={selectAll}
                      onChange={(event) => {
                        setSelectAll(event.target.checked);
                      }}
                    />
                  </th>
                )}

                <th className="">
                  <div className="inline-flex w-full space-x-2 items-center">
                    <i
                      onClick={onClickNameLayout}
                      className="bi bi-grid text-lg cursor-pointer"
                    ></i>
                    <span>Names</span>
                  </div>
                </th>
                <th className="">
                  <div className="inline-flex w-full space-x-2 items-center">
                    <i
                      onClick={onClickLinkLayout}
                      className="bi bi-grid text-lg cursor-pointer"
                    ></i>
                    <span>Links</span>
                  </div>
                </th>
                <th className="">
                  <div className="inline-flex w-full space-x-2 items-center">
                    <i
                      onClick={onClickStateLayout}
                      className="bi bi-grid text-lg cursor-pointer"
                    ></i>
                    <span>States</span>
                  </div>
                </th>
                <th className="">
                  <span>Updated</span>
                </th>
                <th className="">
                  <span>Options</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {content.map((item, index) => {
                const names = item.names;
                const links = item.links;
                const states = item.states;
                const updateDate = getFormattedTime(item.updateDate);
                const eid = item.id;

                return (
                  <tr key={eid}>
                    {turnOnSelectDelete && (
                      <th className="align-top">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          name="selectCurrent"
                          checked={item._checked ?? false}
                          onChange={(event) => {
                            const find = content.find(
                              (value) => value.id === item.id,
                            );
                            if (find) {
                              find._checked = event.target.checked;
                              setContent([...content]);
                            }
                          }}
                        />
                      </th>
                    )}

                    <th className="align-top">
                      {names.length > 0 ? (
                        <div
                          className={clsx(
                            'grid grid-flow-dense items-start gap-4',
                            clickNameLayout
                              ? 'grid-cols-2 w-max'
                              : 'grid-cols-1',
                          )}
                        >
                          {names.map((nameItem) => {
                            return (
                              <div
                                onClick={() => onClickNameItem(item)}
                                key={nameItem.id}
                                className="badge break-all h-auto rounded border-2 link link-hover"
                              >
                                {nameItem.name}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="badge h-auto rounded border-2 text-zinc-200">
                          Empty
                        </div>
                      )}
                    </th>
                    <td className="align-top">
                      {links.length > 0 ? (
                        <div
                          className={clsx(
                            'grid grid-flow-dense items-start gap-4',
                            clickLinkLayout
                              ? 'grid-cols-2 w-max'
                              : 'grid-cols-1',
                          )}
                        >
                          {links.map((item) => {
                            return (
                              <Link
                                target="_blank"
                                rel="noreferrer"
                                href={item.link}
                                key={item.id}
                                className="badge break-all h-auto rounded border-2 link link-hover"
                              >
                                {item.link}
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="badge h-auto rounded border-2 text-zinc-200">
                          Empty
                        </div>
                      )}
                    </td>
                    <td className="align-top">
                      {states.length > 0 ? (
                        <div
                          className={clsx(
                            'grid grid-flow-dense items-start gap-4',
                            clickStateLayout
                              ? 'grid-cols-2 w-max'
                              : 'grid-cols-1',
                          )}
                        >
                          {states.map((item) => {
                            return (
                              <Link
                                href={`/excerpts/${eid}/edit?anchor=states`}
                                key={item.id}
                                className="badge break-all h-auto rounded border-2 link link-hover"
                              >
                                {item.state}
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="badge h-auto rounded border-2 text-zinc-200">
                          Empty
                        </div>
                      )}
                    </td>
                    <td className="align-top whitespace-nowrap">
                      <time dateTime={item.updateDate}>{updateDate}</time>
                    </td>
                    <td className="align-top whitespace-nowrap">
                      <div className="dropdown dropdown-hover dropdown-left">
                        <label tabIndex={0} className="btn btn-sm btn-ghost">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-5 h-5 stroke-current"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                            ></path>
                          </svg>
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                          <li>
                            <Link href={`/excerpts/${eid}/edit`}>Update</Link>
                          </li>
                          {item.enableHistoryLogging && (
                            <li>
                              <Link href={`/excerpts/${item.id}/histories`}>
                                History
                              </Link>
                            </li>
                          )}
                          <li>
                            <Link href={`/excerpts/${item.id}/delete`}>
                              Delete
                            </Link>
                          </li>

                          <li>
                            <Link onClick={onClickBatchDelete} href="">
                              {batchDeletionInProgress
                                ? 'Deleting'
                                : turnOnSelectDelete
                                  ? 'Confirm Batch Delete'
                                  : 'Batch Delete'}
                            </Link>
                          </li>
                          {turnOnSelectDelete && !batchDeletionInProgress && (
                            <li>
                              <Link onClick={onClickCloseSelectDelete} href="">
                                Close Select Delete
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {content.length === 0 && (
            <div className="text-center mt-10 text-zinc-500">
              No relevant data found
            </div>
          )}
        </div>
      </div>
      <dialog ref={dialog} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box overflow-auto">
          <h3 className="font-bold text-lg mb-5">Description</h3>

          {clickedExcerptItem && clickedExcerptItem.description ? (
            <div
              className=""
              dangerouslySetInnerHTML={{
                __html: clickedExcerptItem.description,
              }}
            ></div>
          ) : (
            <div className="py-4 text-zinc-500">
              No description available Or loading data
            </div>
          )}

          <div className="flex space-x-2 items-center justify-end">
            <div className="modal-action">
              <button onClick={onClickDetails} type="button" className="btn">
                Close
              </button>
            </div>
            <div className="modal-action">
              <Link
                onClick={onClickDetails}
                href={
                  clickedExcerptItem
                    ? `/excerpts/${clickedExcerptItem.id}/edit?anchor=description`
                    : '#'
                }
                className="btn"
              >
                <span>Details</span>
              </Link>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
