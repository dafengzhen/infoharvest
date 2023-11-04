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

export default async function ExcerptsAction(
  collectionId: number,
  queryParams?: string[][] | Record<string, string> | string | URLSearchParams,
) {
  const response = await fetch(
    process.env.API_SERVER +
      '/excerpts' +
      '?' +
      `collectionId=${collectionId}` +
      '&' +
      getQueryParams(queryParams),
    {
      headers: AUTHENTICATION_HEADER(checkTicket()),
      next: {
        tags: ['excerpts'],
      },
    },
  );

  const data = (await response.json()) as IPage<IExcerpt[]> | IError;
  if (!response.ok) {
    checkStatusCode((data as IError).statusCode);
    throw FetchDataException((data as IError).message);
  }

  return data as IPage<IExcerpt[]>;
}
