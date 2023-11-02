'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkTicket } from '@/app/common/tool';
import { ICollection } from '@/app/interfaces/collection';

export interface IFindOneCollectionVariables {
  id: number;
}

export default async function FindOneCollectionsAction(
  variables: IFindOneCollectionVariables,
) {
  const response = await fetch(
    process.env.API_SERVER + `/collections/${variables.id}`,
    {
      headers: AUTHENTICATION_HEADER(checkTicket()),
      next: {
        tags: ['collectionById'],
      },
    },
  );

  const data = (await response.json()) as ICollection | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  return data as ICollection;
}
