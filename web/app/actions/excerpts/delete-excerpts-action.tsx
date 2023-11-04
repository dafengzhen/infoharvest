'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, DELETE } from '@/app/constants';
import { checkTicket } from '@/app/common/server';
import { revalidateTag } from 'next/cache';

export interface IDeleteExcerptVariables {
  id: number;
  skipRevalidation?: boolean;
}

export default async function DeleteExcerptsAction(
  variables: IDeleteExcerptVariables,
) {
  const response = await fetch(
    process.env.API_SERVER + `/excerpts/${variables.id}`,
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
    revalidateTag('excerptById');
  }
}
