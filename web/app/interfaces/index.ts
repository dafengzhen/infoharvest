export interface IToken {
  id: number;
  username: string;
  token: string;
  expDays: number;
}

export interface IError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface IPage<T> {
  data: T;
  size: number;
  page: number;
  pages: number;
  next: boolean;
  previous: boolean;
}
