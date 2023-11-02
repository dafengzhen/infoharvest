import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Excerpt } from './excerpt.entity';

/**
 * ExcerptState,
 *
 * @author dafengzhen
 */
@Entity()
export class ExcerptState extends Base {
  constructor(values?: Partial<ExcerptState>) {
    super();
    Object.assign(this, values);
  }

  /**
   * state.
   */
  @Column()
  @Index({ fulltext: true, parser: 'ngram' })
  state: string;

  /**
   * excerpt.
   */
  @ManyToOne(() => Excerpt, (excerpt) => excerpt.states)
  excerpt: Excerpt;
}
