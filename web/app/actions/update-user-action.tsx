import { AUTHENTICATION_HEADER, JSON_HEADER, PATCH } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import UserProfileAction from '@/app/actions/user-profile-action';
import { creationResponse } from '@/app/common/tool';

export interface IUpdateUserActionVariables {
  username?: string;
  oldPassword?: string;
  newPassword?: string;
}

export default async function UpdateUserAction(
  variables: IUpdateUserActionVariables,
) {
  const userResponse = await UserProfileAction();
  if (!userResponse.ok) {
    return userResponse;
  }

  const user = userResponse.data;
  if (!user) {
    return userResponse;
  }

  const path = `/users/${user.id}`;
  const { response } = await creationResponse<void>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      method: PATCH,
      body: JSON.stringify(variables),
      headers: {
        ...JSON_HEADER,
        ...AUTHENTICATION_HEADER(await getTicket()),
      },
    }),
  );

  await checkStatusCode(response);
  return response;
}
