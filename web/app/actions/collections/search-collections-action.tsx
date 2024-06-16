import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { ICollection } from '@/app/interfaces/collection';
import SearchExcerptsAction from '@/app/actions/excerpts/search-excerpts-action';
import QueryCollectionsAction from '@/app/actions/collections/query-collections-action';
import {
  creationResponse,
  creationSuccessful,
  getQueryParams,
} from '@/app/common/tool';
import { IExcerpt } from '@/app/interfaces/excerpt';

export interface ISearchCollectionsActionVariables {
  name: string;
}

export default async function SearchCollectionsAction(
  variables: ISearchCollectionsActionVariables,
) {
  const response = await SearchCollectionsActionCore(variables);
  if (!response.ok) {
    return response;
  }

  const excerptsResponse = await SearchExcerptsAction({ name: variables.name });
  if (!excerptsResponse.ok) {
    return excerptsResponse;
  }

  for (let i = 0; i < excerptsResponse.data.length; i++) {
    const item = excerptsResponse.data[i];
    const collection = item.collection;
    if (collection) {
      const _collection = await QueryCollectionsAction({
        id: collection.id,
      });

      if (_collection.ok) {
        if (!response.data.find((item) => item.id === _collection.data.id)) {
          response.data.push(_collection.data);
        }
      }
    }
  }

  return creationSuccessful<{
    collections: ICollection[];
    excerpts: IExcerpt[];
  }>({
    collections: response.data,
    excerpts: excerptsResponse.data,
  });
}

const SearchCollectionsActionCore = async (
  variables: ISearchCollectionsActionVariables,
) => {
  const path =
    '/collections/search' +
    '?' +
    getQueryParams({ name: encodeURIComponent(variables.name) });
  const { response } = await creationResponse<ICollection[]>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
};
