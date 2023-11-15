'use client';

import { ICollection } from '@/app/interfaces/collection';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import CollectionsAction from '../actions/collections/collections-action';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import SearchCollectionsAction from '../actions/collections/search-collections-action';
import { GlobalContext } from '@/app/contexts';
import { getFormattedTime } from '@/app/common/client';
import clsx from 'clsx';
import CleanEmptySubsetsCollectionsAction from '@/app/actions/collections/clean-empty-subsets-collections-action';

export default function Collections({ data }: { data: ICollection[] }) {
  const { toast } = useContext(GlobalContext);
  const [content, setContent] = useState<ICollection[]>(data);
  const [search, setSearch] = useState('');
  const [clickNameLayout, setClickNameLayout] = useState(false);
  const [clickSubsetLayout, setClickSubsetLayout] = useState(false);
  const [currentCleanEmptySubsetItem, setCurrentCleanEmptySubsetItem] =
    useState<ICollection>();

  const collectionsQuery = useQuery({
    queryKey: ['/collections'],
    queryFn: async () => {
      return (await CollectionsAction()) as ICollection[];
    },
    initialData: data,
  });

  const searchCollectionsMutation = useMutation({
    mutationFn: SearchCollectionsAction,
  });
  const cleanEmptySubsetsCollectionsActionMutation = useMutation({
    mutationFn: CleanEmptySubsetsCollectionsAction,
  });

  useEffect(() => {
    if (collectionsQuery.data) {
      setContent(collectionsQuery.data);
    }
  }, [collectionsQuery.data]);
  useEffect(() => {
    const name = search.trim();
    if (name) {
      searchCollectionsMutation
        .mutateAsync({ name })
        .then(setContent)
        .catch((e) => {
          searchCollectionsMutation.reset();
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

  function onClickSubsetLayout() {
    setClickSubsetLayout(!clickSubsetLayout);
  }

  async function onClickCleanEmptySubsets(
    item: ICollection,
    e: MouseEvent<HTMLAnchorElement>,
  ) {
    if (cleanEmptySubsetsCollectionsActionMutation.isPending) {
      toast.current.showToast({
        type: 'warning',
        message: 'Cleaning up',
      });
      return;
    }

    try {
      e.stopPropagation();
      e.preventDefault();

      setCurrentCleanEmptySubsetItem(item);
      await cleanEmptySubsetsCollectionsActionMutation.mutateAsync({
        id: item.id,
      });
      await collectionsQuery.refetch({ throwOnError: true });

      toast.current.showToast({
        type: 'success',
        message: 'Cleaning empty subsets completed',
        duration: 1500,
      });
    } catch (e: any) {
      cleanEmptySubsetsCollectionsActionMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, clean empty subsets failed'],
      });
    } finally {
      setCurrentCleanEmptySubsetItem(undefined);
    }
  }

  return (
    <div className="px-2 py-4">
      <div className="card bg-base-100 border shadow">
        <div className="card-body">
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
              {content.length > 0 && (
                <Link
                  href="/excerpts/new"
                  className="btn normal-case btn-primary mx-4"
                >
                  New Excerpt
                </Link>
              )}
              <Link
                href="/collections/new"
                className={clsx('btn normal-case btn-primary', {
                  'btn-wide': content.length === 0,
                })}
              >
                New Collection
              </Link>
            </div>
          </div>
          <div className="my-4">
            <table className="table">
              <thead>
                <tr>
                  {/*<th></th>*/}
                  <th className="">
                    <div className="inline-flex w-full space-x-2 items-center">
                      <i
                        onClick={onClickNameLayout}
                        className="bi bi-grid text-lg cursor-pointer"
                      ></i>
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="">
                    {/*<div className="inline-flex w-full space-x-2 items-center">*/}
                    {/*  <i*/}
                    {/*    onClick={onClickSubsetLayout}*/}
                    {/*    className="bi bi-grid text-lg cursor-pointer"*/}
                    {/*  ></i>*/}
                    {/*  <span>Subset</span>*/}
                    {/*</div>*/}
                    Subset
                  </th>
                  <th className="">Created</th>
                  <th className="">Options</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item, index) => {
                  const rowNum = index + 1;
                  const name = item.name;
                  const subset = item.subset;
                  const createDate = getFormattedTime(item.createDate);

                  return (
                    <tr key={item.id}>
                      {/*<th className="align-top">{rowNum}</th>*/}
                      <td className="align-top whitespace-nowrap">
                        <Link
                          href={`/collections/${item.id}`}
                          className="link link-hover link-neutral"
                        >
                          {name}
                        </Link>
                      </td>
                      <td className="align-top">
                        {subset.length > 0 ? (
                          <div
                            className={clsx(
                              'grid items-start gap-4',
                              clickNameLayout
                                ? 'grid-flow-col-dense auto-cols-min'
                                : 'grid-flow-dense auto-rows-auto auto-cols-auto grid-cols-12 whitespace-nowrap',
                            )}
                          >
                            {subset.map((item) => {
                              return (
                                <Link
                                  href={`/collections/${item.id}`}
                                  key={item.id}
                                  className="badge break-all h-auto rounded border-2 link link-hover"
                                >
                                  {typeof item.excerptCount === 'number' &&
                                  item.excerptCount > 0 ? (
                                    <span>
                                      {item.name}&nbsp;
                                      <span className="text-zinc-400">
                                        ({item.excerptCount ?? 0})
                                      </span>
                                    </span>
                                  ) : (
                                    <span>{item.name}</span>
                                  )}
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
                        <time dateTime={item.createDate}>{createDate}</time>
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
                              <Link href={`/collections/${item.id}/edit`}>
                                Update
                              </Link>
                            </li>
                            <li>
                              <Link
                                onClick={(event) =>
                                  onClickCleanEmptySubsets(item, event)
                                }
                                href=""
                              >
                                {cleanEmptySubsetsCollectionsActionMutation.isPending &&
                                currentCleanEmptySubsetItem &&
                                currentCleanEmptySubsetItem.id === item.id
                                  ? 'Cleaning up...'
                                  : 'CleanEmptySubsets'}
                              </Link>
                            </li>
                            <li>
                              <Link href={`/collections/${item.id}/delete`}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
