'use server';

import type { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, POST } from '@/app/constants';
import type { IFolder } from '@/app/bookmarks/bookmarks';
import { checkTicket } from '@/app/common/server';

export interface IImportBookmarkVariables extends IFolder {}

export default async function ImportBookmarkAction(
  variables: IImportBookmarkVariables[],
) {
  const response = await fetch(process.env.API_SERVER + '/import-bookmark', {
    method: POST,
    body: JSON.stringify(variables),
    headers: {
      ...AUTHENTICATION_HEADER(checkTicket()),
      ...JSON_HEADER,
    },
  });

  if (!response.ok) {
    const data = (await response.json()) as IError;
    throw FetchDataException(data.message);
  }
}
