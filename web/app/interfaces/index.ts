export interface IToken {
  id: number;
  username: string;
  token: string;
}

export interface IError {
  message: string;
  statusCode: number;
  error?: string;
}
