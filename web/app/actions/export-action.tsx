'use server';

import { type IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, POST } from '@/app/constants';
import { checkTicket } from '@/app/common/server';

export default async function ExportAction() {
  const response = await fetch(process.env.API_SERVER + '/export', {
    method: POST,
    headers: {
      ...AUTHENTICATION_HEADER(checkTicket()),
      ...JSON_HEADER,
    },
  });

  const data = (await response.json()) as any;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  return data;
}
