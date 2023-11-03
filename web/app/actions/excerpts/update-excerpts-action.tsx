'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, PATCH } from '@/app/constants';
import { checkTicket, excludeId } from '@/app/common/server';

export interface IUpdateExcerptVariables {
  id: number;
  names: string[];
  links?: string[];
  states?: string[];
  icon?: string;
  description?: string;
  sort?: number;
  enableHistoryLogging?: boolean;
  collectionId?: number;
}

export default async function UpdateExcerptsAction(
  variables: IUpdateExcerptVariables,
) {
  const { id, _variables } = excludeId(variables);
  const response = await fetch(process.env.API_SERVER + `/excerpts/${id}`, {
    method: PATCH,
    headers: {
      ...AUTHENTICATION_HEADER(checkTicket()),
      ...JSON_HEADER,
    },
    body: JSON.stringify(_variables),
  });

  if (!response.ok) {
    const data = (await response.json()) as IError;
    throw FetchDataException(data.message);
  }
}
