'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, DELETE } from '@/app/constants';
import { checkTicket } from '@/app/common/server';
import { revalidateTag } from 'next/cache';

export interface ICleanEmptySubsetsCollectionsVariables {
  id: number;
}

export default async function CleanEmptySubsetsCollectionsAction(
  variables: ICleanEmptySubsetsCollectionsVariables,
) {
  const response = await fetch(
    process.env.API_SERVER + `/collections/${variables.id}/cleanEmptySubsets`,
    {
      method: DELETE,
      headers: AUTHENTICATION_HEADER(checkTicket()),
    },
  );

  if (!response.ok) {
    const data = (await response.json()) as IError;
    throw FetchDataException(data.message);
  }

  revalidateTag('collections');
}
