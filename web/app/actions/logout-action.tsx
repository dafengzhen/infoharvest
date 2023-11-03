'use server';

import { deleteTicket } from '@/app/common/server';

export default async function LogoutAction() {
  deleteTicket();
}
