import { AUTHENTICATION_HEADER, DELETE } from "@/app/constants";
import { checkStatusCode, getTicket } from "@/app/common/server";
import { creationResponse } from "@/app/common/tool";

export default async function AccountRemovalAction() {
  const path = '/users';
  const { response } = await creationResponse<void>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      method: DELETE,
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
}
