export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const PATCH = 'PATCH';
export const DELETE = 'DELETE';

export const TK = '_infoharvest_tk';

export const AUTHENTICATION = 'Authentication';

export const BEARER = 'bearer';

export const JSON_HEADER = {
  'Content-Type': 'application/json',
};

export const AUTHENTICATION_HEADER = (tk: string) => {
  return {
    [AUTHENTICATION]: `${BEARER} ${tk}`,
  };
};
