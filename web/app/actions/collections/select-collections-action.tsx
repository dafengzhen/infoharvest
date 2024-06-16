import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { ISelectCollection } from '@/app/interfaces/collection';
import { creationResponse } from '@/app/common/tool';

export default async function SelectCollectionsAction() {
  const path = '/collections/select';
  const { response } = await creationResponse<ISelectCollection[]>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
}
