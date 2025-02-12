import type { IBase } from '@/app/interfaces';
import type { ICollection } from '@/app/interfaces/collection';
import type { IExcerpt } from '@/app/interfaces/excerpt';

export interface ILoginDto {
  password: string;
  username: string;
}

export interface IUpdateUserCustomConfigDto {
  [key: string]: unknown;
  linkTarget?: '_blank' | '_self';
  locked?: boolean;
  type: 'user';
  unlockPassword?: string;
  wallpaper?: string;
}

export interface IUser extends IBase {
  avatar?: string;
  collections: ICollection[];
  customConfig: {
    [key: string]: unknown;
    linkTarget?: '_blank' | '_self';
    locked?: boolean;
    type: 'user';
    unlockPassword?: string;
    wallpaper?: string;
  };
  excerpts: IExcerpt[];
  password?: string;
  username: string;
}
