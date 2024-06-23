import { TK } from '@/app/constants';
import type { IError, IFailed, ISuccessful } from '@/app/interfaces';
import { getPublicPath } from '@/app/common/tool';

const publicPath = getPublicPath();

export const getTicket = async () => {
  return typeof localStorage !== 'undefined'
    ? localStorage.getItem(TK)
    : undefined;
};

export const checkStatusCode = async (
  value: ISuccessful<any> | IFailed<IError>,
) => {
  if (!value.ok && value.error.statusCode === 401) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TK);
      location.assign(publicPath + '/login');
    }
  }
};
