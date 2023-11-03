'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkStatusCode, checkTicket } from '@/app/common/server';
import { ISelectCollection } from '@/app/interfaces/collection';

export default async function SelectCollectionsAction() {
  const response = await fetch(process.env.API_SERVER + '/collections/select', {
    headers: AUTHENTICATION_HEADER(checkTicket()),
    next: {
      tags: ['selectCollection'],
    },
  });

  const data = (await response.json()) as ISelectCollection[] | IError;
  if (!response.ok) {
    checkStatusCode((data as IError).statusCode);
    throw FetchDataException((data as IError).message);
  }

  return data as ISelectCollection[];
}
