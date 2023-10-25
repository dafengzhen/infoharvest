/**
 * BaseVo,
 *
 * @author dafengzhen
 */
export abstract class BaseVo {
  protected constructor(partial?: Partial<BaseVo>) {
    Object.assign(this, partial);
  }

  /**
   * id.
   */
  id?: number;

  /**
   * createDate.
   */
  createDate?: string;

  /**
   * updateDate.
   */
  updateDate?: string;
}
