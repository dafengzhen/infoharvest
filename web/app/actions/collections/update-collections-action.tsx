'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, PATCH } from '@/app/constants';
import { checkTicket } from '@/app/common/tool';
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
  const body = {
    name: variables.name,
    sort: variables.sort,
    subset: variables.subset,
  };

  const response = await fetch(
    process.env.API_SERVER + `/collections/${variables.id}`,
    {
      method: PATCH,
      headers: {
        ...AUTHENTICATION_HEADER(checkTicket()),
        ...JSON_HEADER,
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const data = (await response.json()) as IError;
    throw FetchDataException(data.message);
  }

  revalidateTag('collectionById');
}
