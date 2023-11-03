'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, POST } from '@/app/constants';
import { checkTicket } from '@/app/common/server';

export interface ICreateExcerptVariables {
  names: string[];
  links?: string[];
  states?: string[];
  icon?: string;
  description?: string;
  sort?: number;
  enableHistoryLogging?: boolean;
  collectionId?: number;
}

export default async function CreateExcerptsAction(
  variables: ICreateExcerptVariables,
) {
  const response = await fetch(process.env.API_SERVER + '/excerpts', {
    method: POST,
    headers: {
      ...AUTHENTICATION_HEADER(checkTicket()),
      ...JSON_HEADER,
    },
    body: JSON.stringify(variables),
  });

  if (!response.ok) {
    const data = (await response.json()) as IError;
    throw FetchDataException(data.message);
  }
}
