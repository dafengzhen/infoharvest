'use server';

import { deleteTicket } from '@/app/common/tool';

export default async function LogoutAction() {
  deleteTicket();
}
