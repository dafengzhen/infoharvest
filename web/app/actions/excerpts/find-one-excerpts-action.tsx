'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkTicket } from '@/app/common/server';
import { IExcerpt } from '@/app/interfaces/excerpt';

export interface IFindOneExcerptVariables {
  id: number;
}

export default async function FindOneExcerptsAction(
  variables: IFindOneExcerptVariables,
) {
  const response = await fetch(
    process.env.API_SERVER + `/excerpts/${variables.id}`,
    {
      headers: AUTHENTICATION_HEADER(checkTicket()),
      next: {
        tags: ['excerptById'],
      },
    },
  );

  const data = (await response.json()) as IExcerpt | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  return data as IExcerpt;
}
