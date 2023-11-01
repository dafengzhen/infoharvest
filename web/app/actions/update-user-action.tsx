'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, PATCH } from '@/app/constants';
import { checkTicket } from '@/app/common/tool';
import UserProfileAction from '@/app/actions/user-profile-action';
import { revalidateTag } from 'next/cache';

export interface IUpdateUserVariables {
  username?: string;
  oldPassword?: string;
  newPassword?: string;
}

export default async function UpdateUserAction(
  variables: IUpdateUserVariables,
) {
  const user = await UserProfileAction();
  const response = await fetch(process.env.API_SERVER + `/users/${user.id}`, {
    method: PATCH,
    headers: {
      ...AUTHENTICATION_HEADER(checkTicket()),
      ...JSON_HEADER,
    },
    body: JSON.stringify(variables),
  });

  const data = (await response.json()) as void | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  revalidateTag('userProfile');
}
