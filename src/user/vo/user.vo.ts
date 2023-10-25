import { BaseVo } from '../../common/vo/base.vo';
import { ExcerptVo } from '../../excerpt/vo/excerpt.vo';
import { CollectionVo } from '../../collection/vo/collection.vo';
import { HistoryVo } from '../../history/vo/history.vo';

/**
 * UserVo,
 *
 * @author dafengzhen
 */
export class UserVo extends BaseVo {
  constructor(partial?: Partial<UserVo>) {
    super();
    Object.assign(this, partial);
  }

  /**
   * username.
   */
  username?: string;

  /**
   * collections.
   */
  collections?: CollectionVo[];

  /**
   * excerpts.
   */
  excerpts?: ExcerptVo[];

  /**
   * histories.
   */
  histories?: HistoryVo[];
}
