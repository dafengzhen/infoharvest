import { SetMetadata } from '@nestjs/common';

/**
 * IS_PUBLIC_KEY.
 *
 * @author dafengzhen
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public.
 *
 * @author dafengzhen
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
