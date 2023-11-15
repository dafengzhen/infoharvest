'use server';

import { type IError, IPage } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import {
  checkStatusCode,
  checkTicket,
  getQueryParams,
} from '@/app/common/server';
import { type IExcerpt } from '@/app/interfaces/excerpt';

export default async function ExcerptsAction({
  collectionId,
  queryParams,
}: {
  collectionId?: number;
  queryParams?: string[][] | Record<string, string> | string | URLSearchParams;
} = {}) {
  let url;
  if (queryParams) {
    url =
      process.env.API_SERVER +
      '/excerpts' +
      '?' +
      (collectionId ? `collectionId=${collectionId}` : '') +
      '&' +
      getQueryParams(queryParams);
  } else {
    url =
      process.env.API_SERVER +
      '/excerpts' +
      '?' +
      (collectionId ? `collectionId=${collectionId}` : '');
  }

  const response = await fetch(url, {
    headers: AUTHENTICATION_HEADER(checkTicket()),
    next: {
      tags: ['excerpts'],
    },
  });

  const data = (await response.json()) as
    | IPage<IExcerpt[]>
    | IExcerpt[]
    | IError;
  if (!response.ok) {
    checkStatusCode((data as IError).statusCode);
    throw FetchDataException((data as IError).message);
  }

  return data as IPage<IExcerpt[]> | IExcerpt[];
}
