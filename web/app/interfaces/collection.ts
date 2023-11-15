export interface ICollection {
  id: number;
  createDate: string;
  updateDate: string;
  name: string;
  sort: number;
  excerptCount?: number;
  subset: ICollection[];
  _checked?: boolean;
}

export interface ISelectCollection {
  id: number;
  name: string;
  excerptCount?: number;
  subset: ISelectCollection[];
}
