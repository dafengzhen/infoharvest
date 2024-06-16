import { AUTHENTICATION_HEADER } from '@/app/constants';
import { getTicket } from '@/app/common/server';
import { IUser } from '@/app/interfaces/user';
import { creationResponse } from '@/app/common/tool';

export default async function UserProfileAction() {
  const path = '/users/profile';
  const { response } = await creationResponse<IUser | undefined>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  return response;
}
