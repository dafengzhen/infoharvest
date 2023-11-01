'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkTicket } from '@/app/common/tool';
import { IUser } from '@/app/interfaces/user';

export default async function UserProfileAction() {
  const response = await fetch(process.env.API_SERVER + '/users/profile', {
    headers: AUTHENTICATION_HEADER(checkTicket()),
    next: {
      tags: ['userProfile'],
    },
  });

  const data = (await response.json()) as IUser | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  return data as IUser;
}
