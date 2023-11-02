'use client';

import { ICollection } from '@/app/interfaces/collection';
import { IPage } from '@/app/interfaces';
import format from 'date-fns/format';
import Link from 'next/link';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import CollectionsAction from '@/app/actions/collections-action';
import { useEffect, useState } from 'react';
import SearchCollectionsAction from '@/app/actions/search-collections-action';

export default function Collections({ data }: { data: IPage<ICollection[]> }) {
  const [content, setContent] = useState<ICollection[]>(data.data);
  const [search, setSearch] = useState('');

  const collectionsQuery = useInfiniteQuery({
    queryKey: ['/collections', 'infinite'],
    queryFn: async (context) => {
      return CollectionsAction({ page: context.pageParam.page + '' });
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

  const searchCollectionsMutation = useMutation({
    mutationFn: SearchCollectionsAction,
  });

  useEffect(() => {
    if (collectionsQuery.data) {
      setContent(collectionsQuery.data.pages.flatMap((item) => item.data));
    }
  }, [collectionsQuery.data]);
  useEffect(() => {
    const name = search.trim();
    if (name) {
      searchCollectionsMutation.mutateAsync({ name });
    }
  }, [search]);

  function onClickNewCollection() {}

  return (
    <div className="px-2 py-4">
      <div className="card bg-base-100 border shadow">
        <div className="card-body">
          <div className="flex justify-between">
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
                href="/collections/new"
                onClick={onClickNewCollection}
                className="btn btn-wide normal-case btn-primary"
              >
                New Collection
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto my-4 min-h-full">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-sm">Name</th>
                  <th className="text-sm">Subset</th>
                  <th className="text-sm">Created</th>
                  <th className="text-sm">Options</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => {
                  const name = item.name;
                  const subset = item.subset;
                  const createDate = format(
                    new Date(item.createDate),
                    'yyyy-MM-dd',
                  );

                  return (
                    <tr key={item.id}>
                      <td>
                        <a className="link link-hover link-neutral">{name}</a>
                      </td>
                      <td>
                        <div className="flex space-x-4">
                          {subset.map((item) => {
                            return (
                              <Link
                                href="#"
                                key={item.id}
                                className="badge rounded border-2 link link-hover"
                              >
                                {item.name}
                              </Link>
                            );
                          })}
                        </div>
                      </td>
                      <td>{createDate}</td>
                      <td>
                        <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
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
                              <a>Update</a>
                            </li>
                            <li>
                              <a>Delete</a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="my-4 mt-12 text-center">
              <div data-tip="Load more" className="tooltip w-4/5">
                <button className="btn btn-ghost w-full btn-sm">
                  <i className="bi bi-three-dots"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
