'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, DELETE } from '@/app/constants';
import { checkTicket } from '@/app/common/tool';

export default async function AccountRemovalAction() {
  const response = await fetch(process.env.API_SERVER + '/users', {
    method: DELETE,
    headers: {
      ...AUTHENTICATION_HEADER(checkTicket()),
    },
  });

  if (!response.ok) {
    const data = (await response.json()) as IError;
    throw FetchDataException(data.message);
  }
}
