'use server';

import type { IError, IPage } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import {
  checkStatusCode,
  checkTicket,
  getQueryParams,
} from '@/app/common/server';
import type { ICollection } from '@/app/interfaces/collection';

export default async function CollectionsAction(
  queryParams?: string[][] | Record<string, string> | string | URLSearchParams,
) {
  let url;
  if (queryParams) {
    url =
      process.env.API_SERVER +
      '/collections' +
      '?' +
      getQueryParams(queryParams);
  } else {
    url = process.env.API_SERVER + '/collections';
  }

  const response = await fetch(url, {
    headers: AUTHENTICATION_HEADER(checkTicket()),
    next: {
      tags: ['collections'],
    },
  });

  const data = (await response.json()) as
    | IPage<ICollection[]>
    | ICollection[]
    | IError;
  if (!response.ok) {
    checkStatusCode((data as IError).statusCode);
    throw FetchDataException((data as IError).message);
  }

  return data as IPage<ICollection[]> | ICollection[];
}
