'use client';

import type { IExcerpt } from '@/app/interfaces/excerpt';
import type { IHistory } from '@/app/interfaces/history';
import clsx from 'clsx';
import { useState } from 'react';
import { getFormattedTime } from '@/app/common/client';
import Link from 'next/link';

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
  const [histories, setHistories] = useState<IItem[]>(
    data.map((item) => ({ ...item, _openCollapse: false })),
  );

  function onClickItem(item: IItem) {
    histories.forEach((value) => {
      value._openCollapse = value.id === item.id;
    });
    setHistories([...histories]);
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
              <p>Excerpted Change History</p>
              <p></p>
            </div>
          </div>
          <div className="my-4"></div>
          {histories.map((item) => {
            return (
              <div
                key={item.id}
                className={clsx(
                  'collapse collapse-arrow bg-base-200',
                  item._openCollapse ? 'collapse-open' : 'collapse-close',
                )}
              >
                <div
                  onClick={() => onClickItem(item)}
                  className="collapse-title text-xl cursor-pointer font-medium truncate"
                >
                  <time dateTime={item.createDate}>
                    {getFormattedTime(item.createDate)}
                  </time>
                  &nbsp;
                  {item.hNames.join(' / ')}
                </div>
                <div className="collapse-content">
                  <div className="overflow-x-auto h-96">
                    <table className="table table-pin-rows text-base">
                      {item.icon && (
                        <>
                          <thead className="text-sm text-info">
                            <tr className="hover:bg-base-200">
                              <th>Icon</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:text-info">
                              <td className="truncate">{item.icon}</td>
                            </tr>
                          </tbody>
                        </>
                      )}

                      {item.description && (
                        <>
                          <thead className="text-sm text-info">
                            <tr className="hover:bg-base-200">
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item.description,
                                  }}
                                ></div>
                              </td>
                            </tr>
                          </tbody>
                        </>
                      )}

                      {item.hNames && (
                        <>
                          <thead className="text-sm text-info">
                            <tr className="hover:bg-base-200">
                              <th>Names</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.hNames.map((value, index) => {
                              return (
                                <tr className="hover:text-info" key={index}>
                                  <td>{value}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </>
                      )}

                      {item.hLinks && (
                        <>
                          <thead className="text-sm text-info">
                            <tr className="hover:bg-base-200">
                              <th>Links</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.hLinks.map((value, index) => {
                              return (
                                <tr className="hover:text-info" key={index}>
                                  <td>
                                    <Link
                                      target="_blank"
                                      rel="noreferrer"
                                      href={value}
                                      className="truncate link link-hover"
                                    >
                                      {value}
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </>
                      )}

                      {item.hStates && (
                        <>
                          <thead className="text-sm text-info">
                            <tr className="hover:bg-base-200">
                              <th>States</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.hStates.map((value, index) => {
                              return (
                                <tr className="hover:text-info" key={index}>
                                  <td>{value}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </>
                      )}

                      {item.collection && (
                        <>
                          <thead className="text-sm text-info">
                            <tr className="hover:bg-base-200">
                              <th>Collection</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:text-info">
                              <td>{item.collection.name}</td>
                            </tr>
                          </tbody>
                        </>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
