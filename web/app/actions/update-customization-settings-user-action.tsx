import { AUTHENTICATION_HEADER, JSON_HEADER, PUT } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import UserProfileAction from '@/app/actions/user-profile-action';
import { creationResponse } from '@/app/common/tool';

export interface IUpdateCustomizationSettingsUserActionVariables {
  wallpaper?: string;
}

export default async function UpdateCustomizationSettingsUserAction(
  variables: IUpdateCustomizationSettingsUserActionVariables,
) {
  const userResponse = await UserProfileAction();
  if (!userResponse.ok) {
    return userResponse;
  }

  const user = userResponse.data;
  if (!user) {
    return userResponse;
  }

  const path = `/users/${user.id}/customization-settings`;
  const { response } = await creationResponse<void>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      method: PUT,
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
