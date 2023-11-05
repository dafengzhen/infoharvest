'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { type ICollection } from '@/app/interfaces/collection';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchExcerptsAction from '@/app/actions/excerpts/search-excerpts-action';
import { type IExcerpt } from '@/app/interfaces/excerpt';
import { type IPage } from '@/app/interfaces';
import ExcerptsAction from '@/app/actions/excerpts/excerpts-action';
import { getFormattedTime } from '@/app/common/client';
import clsx from 'clsx';

export default function Excerpts({
  collection,
  data,
}: {
  collection?: ICollection;
  data: IPage<IExcerpt[]>;
}) {
  const router = useRouter();
  const { toast, tagState } = useContext(GlobalContext);
  const [tag, setTag] = tagState ?? [];
  const [search, setSearch] = useState('');
  const [content, setContent] = useState<IExcerpt[]>(data.data);
  const [clickNameLayout, setClickNameLayout] = useState(false);
  const [clickLinkLayout, setClickLinkLayout] = useState(false);
  const [clickStateLayout, setClickStateLayout] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [clickedExcerptItem, setClickedExcerptItem] = useState<IExcerpt>();

  const excerptsQuery = useInfiniteQuery({
    queryKey: ['/excerpts', 'infinite'],
    queryFn: async (context) => {
      return ExcerptsAction({
        collectionId: collection?.id,
        queryParams: {
          page: context.pageParam.page + '',
        },
      });
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage.previous) {
        return;
      }
      return {
        page: Math.max(firstPage.page - 1, 1),
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) {
        return;
      }
      return {
        page: Math.min(lastPage.page + 1, lastPage.pages),
      };
    },
    initialData: () => {
      return {
        pages: [data],
        pageParams: [{ page: 1 }],
      };
    },
    initialPageParam: { page: 1 },
  });

  const searchExcerptsActionMutation = useMutation({
    mutationFn: SearchExcerptsAction,
  });

  useEffect(() => {
    if (excerptsQuery.data) {
      setContent(excerptsQuery.data.pages.flatMap((item) => item.data));
    }
  }, [excerptsQuery.data]);
  useEffect(() => {
    const name = search.trim();
    if (name) {
      searchExcerptsActionMutation.mutateAsync({ name }).then(setContent);
    } else {
      setContent(data.data);
    }
  }, [search]);
  useEffect(() => {
    if (tag === 'excerpts') {
      excerptsQuery.refetch().finally(() => {
        setTag?.('');
      });
    }
  }, [tag]);

  async function onClickLoadMore() {
    if (excerptsQuery.isPending) {
      toast.current.showToast({
        type: 'warning',
        message: 'Processing...',
      });
      return;
    }

    if (!excerptsQuery.hasNextPage) {
      toast.current.showToast({
        type: 'warning',
        message: 'No more data on the next page',
      });
      return;
    }

    await excerptsQuery.fetchNextPage();
  }

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
              href="/excerpts/new"
              className="btn btn-wide normal-case btn-primary"
            >
              New Excerpt
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto my-4 min-h-full">
          <table className="table">
            <thead>
              <tr className="">
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
                {/*<th className="">*/}
                {/*  <span>Description</span>*/}
                {/*</th>*/}
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
                const rowNum = index + 1;
                const names = item.names;
                const links = item.links;
                const states = item.states;
                const description = item.description ?? '';
                const updateDate = getFormattedTime(item.updateDate);
                const eid = item.id;

                return (
                  <tr key={eid}>
                    <th className="align-top">
                      {names.length > 0 ? (
                        <div
                          className={clsx(
                            'grid grid-flow-dense items-start gap-4',
                            clickNameLayout ? 'grid-cols-1' : 'grid-cols-2',
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
                            clickLinkLayout ? 'grid-cols-1' : 'grid-cols-2',
                          )}
                        >
                          {links.map((item) => {
                            return (
                              <Link
                                target="_blank"
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
                            'grid grid-flow-dense items-start w-max gap-4',
                            clickStateLayout ? 'grid-cols-1' : 'grid-cols-2',
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
                    {/*<td className="align-top">*/}
                    {/*  {description && (*/}
                    {/*    <div*/}
                    {/*      className="max-h-24 text-ellipsis overflow-hidden"*/}
                    {/*      dangerouslySetInnerHTML={{ __html: description }}*/}
                    {/*    ></div>*/}
                    {/*  )}*/}
                    {/*</td>*/}
                    <td className="align-top">
                      <time dateTime={item.updateDate}>{updateDate}</time>
                    </td>
                    <td className="align-top">
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
                          <li>
                            <Link href={`/excerpts/${item.id}/delete`}>
                              Delete
                            </Link>
                          </li>
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

          <div className="my-4 mt-12 text-center">
            <div data-tip="Load more" className="tooltip w-4/5">
              <button
                onClick={onClickLoadMore}
                className="btn btn-ghost w-full btn-sm"
              >
                <i className="bi bi-three-dots"></i>
              </button>
            </div>
          </div>
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

          <div className="flex space-x-2 justify-end">
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
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
      </dialog>
    </>
  );
}
