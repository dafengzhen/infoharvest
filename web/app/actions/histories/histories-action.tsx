'use server';

import { type IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkStatusCode, checkTicket } from '@/app/common/server';
import { IHistory } from '@/app/interfaces/history';

export default async function HistoriesAction(excerptId: number) {
  const response = await fetch(
    process.env.API_SERVER + '/histories' + `?excerptId=${excerptId}`,
    {
      headers: AUTHENTICATION_HEADER(checkTicket()),
      next: {
        tags: ['histories'],
      },
    },
  );

  const data = (await response.json()) as IHistory[] | IError;
  if (!response.ok) {
    checkStatusCode((data as IError).statusCode);
    throw FetchDataException((data as IError).message);
  }

  return data as IHistory[];
}
