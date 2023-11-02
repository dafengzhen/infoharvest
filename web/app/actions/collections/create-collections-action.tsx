'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, POST } from '@/app/constants';
import { checkTicket } from '@/app/common/tool';
import { revalidateTag } from 'next/cache';

export interface ICreateCollectionVariables {
  name: string;
}

export default async function CreateCollectionsAction(
  variables: ICreateCollectionVariables,
) {
  const response = await fetch(process.env.API_SERVER + '/collections', {
    method: POST,
    headers: {
      ...AUTHENTICATION_HEADER(checkTicket()),
      ...JSON_HEADER,
    },
    body: JSON.stringify(variables),
  });

  if (!response.ok) {
    const data = (await response.json()) as IError;
    throw FetchDataException(data.message);
  }

  revalidateTag('collections');
}
