import { ExcerptVo } from '../../excerpt/vo/excerpt.vo';

/**
 * HistoryVo,
 *
 * @author dafengzhen
 */
export class HistoryVo extends ExcerptVo {
  constructor(partial?: Partial<History>) {
    super();
    Object.assign(this, partial);
  }

  /**
   * excerpt.
   */
  excerpt?: ExcerptVo;
}
