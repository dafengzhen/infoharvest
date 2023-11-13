'use client';

import { type MouseEvent, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import { type ICollection } from '@/app/interfaces/collection';
import { useRouter } from 'next/navigation';
import Excerpts from '@/app/excerpts/excerpts';
import { type IPage } from '@/app/interfaces';
import { type IExcerpt } from '@/app/interfaces/excerpt';
import { useInfiniteQuery } from '@tanstack/react-query';
import CollectionsAction from '@/app/actions/collections/collections-action';
import clsx from 'clsx';

export default function CollectionId({
  collection,
  collections,
  data,
}: {
  collection: ICollection;
  collections: IPage<ICollection[]>;
  data: IPage<IExcerpt[]>;
}) {
  const router = useRouter();
  const { toast, tagState } = useContext(GlobalContext);
  const [content, setContent] = useState<ICollection[]>(collections.data);

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
        pages: [collections],
        pageParams: [{ page: 1 }],
      };
    },
    initialPageParam: { page: 1 },
  });

  useEffect(() => {
    if (collectionsQuery.data) {
      setContent(collectionsQuery.data.pages.flatMap((item) => item.data));
    }
  }, [collectionsQuery.data]);

  async function onClickLoadMore() {
    if (collectionsQuery.isPending) {
      toast.current.showToast({
        type: 'warning',
        message: 'Processing...',
      });
      return;
    }

    if (!collectionsQuery.hasNextPage) {
      toast.current.showToast({
        type: 'warning',
        message: 'No more data on the next page',
      });
      return;
    }

    await collectionsQuery.fetchNextPage();
  }

  function onClickMenuItem(
    item: ICollection,
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    event.stopPropagation();
    event.preventDefault();
    router.push(`/collections/${item.id}`);
  }

  return (
    <div className="px-2 py-4">
      <div className="card bg-base-100 border shadow">
        <div className="card-body">
          <div className="flex space-x-4">
            <div className="w-1/6">
              <ul className="menu bg-base-200 rounded-box">
                {content.map((item) => {
                  return (
                    <li key={item.id}>
                      <a
                        onClick={(event) => onClickMenuItem(item, event)}
                        className={clsx({
                          active: collection.id === item.id,
                        })}
                      >
                        {item.name}
                      </a>
                      <ul>
                        {item.subset.map((subset) => {
                          return (
                            <li key={subset.id}>
                              <a
                                onClick={(event) =>
                                  onClickMenuItem(subset, event)
                                }
                                className={clsx({
                                  active: collection.id === subset.id,
                                })}
                              >
                                {subset.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>

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
            <div className="w-5/6">
              <Excerpts collection={collection} data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
