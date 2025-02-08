export interface IBase {
  createDate: string;
  deleteDate?: string;
  id: number;
  updateDate?: string;
  version?: number;
}

export interface IError {
  code?: number | string;
  error?: unknown;
  message: string;
  statusCode?: number;
}

export interface IToken {
  expDays: number;
  id: number;
  token: string;
  username: string;
}
