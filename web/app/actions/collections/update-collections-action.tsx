'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, PATCH } from '@/app/constants';
import { checkTicket, excludeId } from '@/app/common/server';
import { revalidateTag } from 'next/cache';

export interface IUpdateCollectionVariables {
  id: number;
  name?: string;
  sort?: number;
  subset?: Partial<Omit<IUpdateCollectionVariables, 'subset'>>[];
}

export default async function UpdateCollectionsAction(
  variables: IUpdateCollectionVariables,
) {
  const { id, _variables } = excludeId(variables);
  const response = await fetch(process.env.API_SERVER + `/collections/${id}`, {
    method: PATCH,
    headers: {
      ...AUTHENTICATION_HEADER(checkTicket()),
      ...JSON_HEADER,
    },
    body: JSON.stringify(_variables),
  });

  if (!response.ok) {
    const data = (await response.json()) as IError;
    throw FetchDataException(data.message);
  }

  revalidateTag('collectionById');
}
