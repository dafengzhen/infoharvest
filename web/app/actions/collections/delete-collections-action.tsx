'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, DELETE } from '@/app/constants';
import { checkTicket } from '@/app/common/tool';
import { revalidateTag } from 'next/cache';

export interface IDeleteCollectionVariables {
  id: number;
  skipRevalidation?: boolean;
}

export default async function DeleteCollectionsAction(
  variables: IDeleteCollectionVariables,
) {
  const response = await fetch(
    process.env.API_SERVER + `/collections/${variables.id}`,
    {
      method: DELETE,
      headers: AUTHENTICATION_HEADER(checkTicket()),
    },
  );

  if (!response.ok) {
    const data = (await response.json()) as IError;
    throw FetchDataException(data.message);
  }

  const skipRevalidation = variables.skipRevalidation ?? true;
  if (!skipRevalidation) {
    revalidateTag('collectionById');
  }
}
