import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Excerpt } from './excerpt.entity';

/**
 * ExcerptLink,
 *
 * @author dafengzhen
 */
@Entity()
export class ExcerptLink extends Base {
  constructor(values?: Partial<ExcerptLink>) {
    super();
    Object.assign(this, values);
  }

  /**
   * link.
   */
  @Index({ fulltext: true })
  @Column()
  link: string;

  /**
   * excerpt.
   */
  @ManyToOne(() => Excerpt, (excerpt) => excerpt.links)
  excerpt: Excerpt;
}
