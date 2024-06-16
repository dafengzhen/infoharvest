import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import type { IHistory } from '@/app/interfaces/history';
import { creationResponse } from '@/app/common/tool';

export default async function HistoriesAction(excerptId: number | string) {
  const path = `/histories?excerptId=${excerptId}`;
  const { response } = await creationResponse<IHistory[]>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
}
