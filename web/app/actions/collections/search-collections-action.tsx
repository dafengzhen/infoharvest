'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkTicket, getQueryParams } from '@/app/common/server';
import { ICollection } from '@/app/interfaces/collection';
import SearchExcerptsAction from '@/app/actions/excerpts/search-excerpts-action';
import FindOneCollectionsAction from '@/app/actions/collections/find-one-collections-action';

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

  const excerpts = await SearchExcerptsAction({ name: variables.name });
  for (let i = 0; i < excerpts.length; i++) {
    const collection = await FindOneCollectionsAction({
      id: excerpts[i].collection!.id,
    });
    if (!(data as ICollection[]).find((item) => item.id === collection.id)) {
      (data as ICollection[]).push(collection);
    }
  }

  return data as ICollection[];
}
