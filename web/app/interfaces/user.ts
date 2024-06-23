export type TUsersCountByDate = {
  date: string;
  count: number;
}[];

export interface IUser {
  id: number;
  username: string;
  password?: string;
  avatar?: string;
  example?: boolean;
  createDate: string;
  updateDate: string;
  customizationSettings?: ICustomizationSettings;
}

export interface ICustomizationSettings {
  wallpaper?: string;
}
