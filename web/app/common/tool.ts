import type {
  ICompleted,
  IError,
  IFailed,
  ISuccessful,
} from '@/app/interfaces';
import { format } from 'date-fns';
import { TK } from '@/app/constants';

export const creationFailed = <T>(error: T): IFailed<T> => {
  return {
    ok: false,
    error,
  };
};

export const creationSuccessful = <T>(data: T): ISuccessful<T> => {
  return {
    ok: true,
    data,
  };
};

export const creationCompleted = <T>(
  response: T,
  instance: Response,
): ICompleted<T> => {
  return {
    response,
    instance,
  };
};

export const creationResponse = async <T>(response: Promise<Response>) => {
  const _response = await response;

  try {
    const contentType = _response.headers.get('Content-Type');

    let value: T = undefined as T;
    if (contentType) {
      if (contentType.includes('application/json')) {
        value = (await _response.json()) as T;
      } else if (contentType.includes('text/plain')) {
        value = (await _response.text()) as T;
      } else {
        console.debug('Content-Type => ', contentType);
        return creationCompleted<IFailed<IError>>(
          creationFailed<IError>({
            message: 'Unsupported data type.',
          }),
          _response,
        );
      }
    }

    let data;
    if (_response.ok) {
      data = creationCompleted<ISuccessful<T>>(
        creationSuccessful(value),
        _response,
      );
    } else {
      data = creationCompleted<IFailed<IError>>(
        creationFailed(value as IError),
        _response,
      );
    }

    return data;
  } catch (e) {
    console.error(e);
    const _e = e as Error;
    const code = (_e.cause as { code?: string } | undefined)?.code;
    const message = _e.message ?? 'Unknown error.';
    return creationCompleted<IFailed<IError>>(
      creationFailed<IError>({
        message: code ? code + ' - ' + message : message,
        code: (_e.cause as { code?: string } | undefined)?.code,
      }),
      _response,
    );
  }
};

export const convertToCookieExpiration = (days: number) => {
  return new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
};

export const getQueryParams = (
  init?: string[][] | Record<string, string> | string | URLSearchParams,
) => {
  return new URLSearchParams(init).toString();
};

export const destructureId = (source: Record<string, any>) => {
  const { id, ..._variables } = source;
  return { id, _variables };
};

export const processFirstCharacter = (username: string) => {
  let firstChar = username.substring(0, 1);
  if (/^[a-zA-Z]/.test(firstChar)) {
    firstChar = firstChar.toUpperCase();
  }
  return firstChar;
};

export const uniqueArrayByProperty = (
  array: any[],
  property: string = 'id',
) => {
  return array.reduce((acc: any[], obj) => {
    const found = acc.find((item) => item[property] === obj[property]);
    if (!found) {
      acc.push(obj);
    }
    return acc;
  }, []);
};

export const isHttpOrHttps = (value: string) => {
  return value.startsWith('http') || value.startsWith('https');
};

export const getFormattedTime = (time: string) => {
  const giveDate = new Date(time);
  return format(
    giveDate,
    new Date().getFullYear() === giveDate.getFullYear()
      ? 'MM-dd'
      : 'yyyy-MM-dd',
  );
};

export const formatCurrentDateTime = (date?: Date, f?: string) => {
  return format(date ?? new Date(), f ?? 'yyyy-MM-dd HH:mm:ss');
};

export const compressHTML = (html: string) => {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><');
};

export const getPublicPath = () => {
  const publicPath = process.env.NEXT_PUBLIC_PUBLIC_PATH;
  return publicPath ?? '';
};

export const checkLoginStatus = () => {
  return (
    typeof localStorage !== 'undefined' &&
    typeof localStorage.getItem(TK) === 'string'
  );
};
