'use client';

import type { IExcerpt } from '@/app/interfaces/excerpt';
import type { IHistory } from '@/app/interfaces/history';
import { useState } from 'react';
import { getFormattedTime } from '@/app/common/client';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface IItem extends IHistory {
  _openCollapse: boolean;
}

export default function Histories({
  excerpt,
  data,
}: {
  excerpt: IExcerpt;
  data: IHistory[];
}) {
  const router = useRouter();
  const [histories, setHistories] = useState<IItem[]>(
    data.map((item) => ({ ...item, _openCollapse: false })),
  );

  function onClickReturn() {
    router.back();
  }

  return (
    <div className="px-2 py-4 mx-auto">
      <div className="card bg-base-100 border shadow">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title mb-2 truncate">
                {excerpt.names.map((item) => item.name).join(' / ')}
                &nbsp;⌈ID. {excerpt.id}⌋
              </h2>
              <p>Excerpted Change History in Sequential Order</p>
              <p></p>
            </div>
            <button
              type="button"
              onClick={onClickReturn}
              className="btn btn-wide normal-case btn-primary"
            >
              Return
            </button>
          </div>
          <div className="my-4"></div>
          <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
            {histories.map((item, index) => {
              return (
                <li key={item.id}>
                  {index > 0 && <hr />}

                  <div className="timeline-middle">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div
                    className={clsx(
                      'mx-4 mb-10',
                      index % 2 === 0
                        ? 'timeline-start md:text-end'
                        : 'timeline-end',
                    )}
                  >
                    <time
                      className="font-mono italic"
                      dateTime={item.createDate}
                    >
                      {getFormattedTime(item.createDate)}
                    </time>
                    {item.collection && (
                      <div className="mb-2">{item.collection.name}</div>
                    )}

                    {item.hNames.length > 0 && (
                      <div className="my-1">
                        {item.hNames.map((name) => {
                          return (
                            <div key={name} className="text-lg font-black">
                              {name}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {item.hLinks.length > 0 && (
                      <div className="my-1">
                        {item.hLinks.map((link) => {
                          return (
                            <div key={link} className="text-lg font-black">
                              <Link
                                target="_blank"
                                rel="noreferrer"
                                href={link}
                                className="truncate link link-hover"
                              >
                                {link}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {item.hStates.length > 0 && (
                      <div className="my-1">
                        {item.hStates.map((state) => {
                          return (
                            <div key={state} className="text-lg font-black">
                              {state}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {item.description && (
                      <div className="mt-2">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <hr />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
