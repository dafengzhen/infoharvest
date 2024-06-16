import { AUTHENTICATION_HEADER, JSON_HEADER, POST } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { creationResponse } from '@/app/common/tool';

export default async function ImportAction(variables: Record<string, any>) {
  const path = '/import';
  const { response } = await creationResponse<void>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      method: POST,
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
