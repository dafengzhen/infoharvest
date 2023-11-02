'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkTicket, getQueryParams } from '@/app/common/tool';
import { ICollection } from '@/app/interfaces/collection';

export interface ISearchCollectionVariables {
  name: string;
}

export default async function SearchCollectionsAction(
  variables: ISearchCollectionVariables,
) {
  const response = await fetch(
    process.env.API_SERVER +
      '/collections/search' +
      '?' +
      getQueryParams({ name: encodeURIComponent(variables.name) }),
    {
      headers: AUTHENTICATION_HEADER(checkTicket()),
    },
  );

  const data = (await response.json()) as ICollection[] | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  return data as ICollection[];
}
