export interface IToken {
  id: number;
  username: string;
  token: string;
  expDays: number;
}

export interface IError {
  message: string;
  statusCode?: number;
  error?: unknown;
  code?: number | string;
}

export interface IPage<T> {
  data: T;
  size: number;
  page: number;
  pages: number;
  next: boolean;
  previous: boolean;
}

export interface IHealth {
  status: 'UP';
}

export interface IFailed<T> {
  ok: false;
  error: T;
}

export interface ISuccessful<T> {
  ok: true;
  data: T;
}

export interface ICompleted<T> {
  response: T;
  instance: Response;
}
