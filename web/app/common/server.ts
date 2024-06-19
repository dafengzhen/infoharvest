import { TK } from '@/app/constants';
import type { IError, IFailed, ISuccessful } from '@/app/interfaces';
import { getPublicPath } from '@/app/common/tool';

const publicPath = getPublicPath();

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
