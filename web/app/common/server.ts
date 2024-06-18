import { TK } from '@/app/constants';
import type { IError, IFailed, ISuccessful } from '@/app/interfaces';

const publicPath = process.env.NEXT_PUBLIC_PUBLIC_PATH;

export const getTicket = async () => {
  return localStorage.getItem(TK);
};

export const checkStatusCode = async (
  value: ISuccessful<any> | IFailed<IError>,
) => {
  if (!value.ok && value.error.statusCode === 401) {
    localStorage.removeItem(TK);
    location.assign(publicPath + '/login');
  }
};
