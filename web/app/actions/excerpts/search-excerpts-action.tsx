'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkTicket, getQueryParams } from '@/app/common/server';
import { IExcerpt } from '@/app/interfaces/excerpt';

export interface ISearchExcerptsActionVariables {
  name: string;
}

export default async function SearchExcerptsAction(
  variables: ISearchExcerptsActionVariables,
) {
  const response = await fetch(
    process.env.API_SERVER +
      '/excerpts/search' +
      '?' +
      getQueryParams({ name: encodeURIComponent(variables.name) }),
    {
      headers: AUTHENTICATION_HEADER(checkTicket()),
    },
  );

  const data = (await response.json()) as IExcerpt[] | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  return data as IExcerpt[];
}
