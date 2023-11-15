'use client';

import { type MouseEvent, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import { type ICollection } from '@/app/interfaces/collection';
import { useRouter } from 'next/navigation';
import Excerpts from '@/app/excerpts/excerpts';
import { type IExcerpt } from '@/app/interfaces/excerpt';
import CollectionsAction from '@/app/actions/collections/collections-action';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

export default function CollectionId({
  collection,
  collections,
  data,
}: {
  collection: ICollection;
  collections: ICollection[];
  data: IExcerpt[];
}) {
  const router = useRouter();
  const { toast, tagState } = useContext(GlobalContext);
  const [content, setContent] = useState<ICollection[]>(collections);

  const collectionsQuery = useQuery({
    queryKey: ['/collections'],
    queryFn: async () => {
      return (await CollectionsAction()) as ICollection[];
    },
    initialData: collections,
  });

  useEffect(() => {
    if (collectionsQuery.data) {
      setContent(collectionsQuery.data);
    }
  }, [collectionsQuery.data]);

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
