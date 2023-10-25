import { BaseVo } from '../../common/vo/base.vo';
import { UserVo } from '../../user/vo/user.vo';
import { CollectionVo } from '../../collection/vo/collection.vo';

/**
 * ExcerptVo,
 *
 * @author dafengzhen
 */
export class ExcerptVo extends BaseVo {
  constructor(partial?: Partial<ExcerptVo>) {
    super();
    Object.assign(this, partial);
  }

  /**
   * names.
   */
  names?: string[];

  /**
   * selectedSubsetName.
   */
  selectedSubsetName?: string[];

  /**
   * links.
   */
  links?: string[];

  /**
   * states.
   */
  states?: string[];

  /**
   * description.
   */
  description?: string;

  /**
   * sort.
   */
  sort?: number;

  /**
   * enableHistoryLogging.
   */
  enableHistoryLogging?: boolean;

  /**
   * user.
   */
  user?: UserVo;

  /**
   * collection.
   */
  collection?: CollectionVo;
}
