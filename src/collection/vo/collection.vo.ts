import { BaseVo } from '../../common/vo/base.vo';
import { UserVo } from '../../user/vo/user.vo';
import { ExcerptVo } from '../../excerpt/vo/excerpt.vo';

/**
 * CollectionVo,
 *
 * @author dafengzhen
 */
export class CollectionVo extends BaseVo {
  constructor(partial?: Partial<CollectionVo>) {
    super();
    Object.assign(this, partial);
  }

  /**
   * name.
   */
  name?: string;

  /**
   * subsetName.
   */
  subsetName?: string[];

  /**
   * sort.
   */
  sort?: number;

  /**
   * user.
   */
  user?: UserVo;

  /**
   * excerpts.
   */
  excerpts?: ExcerptVo[];
}
