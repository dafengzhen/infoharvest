export interface ICollection {
  id: number;
  createDate: string;
  updateDate: string;
  name: string;
  sort: number;
  subset: ICollection[];
}

export interface ISelectCollection {
  id: number;
  name: string;
  subset: ISelectCollection[];
}
