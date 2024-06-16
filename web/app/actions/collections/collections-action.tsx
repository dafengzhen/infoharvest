import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import type { ICollection } from '@/app/interfaces/collection';
import { creationResponse } from '@/app/common/tool';

export default async function CollectionsAction() {
  const path = '/collections';
  const { response } = await creationResponse<ICollection[]>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
}
