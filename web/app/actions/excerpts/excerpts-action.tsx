import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { type IExcerpt } from '@/app/interfaces/excerpt';
import { creationResponse } from '@/app/common/tool';

export default async function ExcerptsAction({
  collectionId,
}: {
  collectionId?: number | string | null | undefined;
} = {}) {
  const path =
    '/excerpts' + (collectionId ? `?collectionId=${collectionId}` : '');
  const { response } = await creationResponse<IExcerpt[]>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
}
