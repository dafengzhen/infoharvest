import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Excerpt } from './excerpt.entity';

/**
 * ExcerptName,
 *
 * @author dafengzhen
 */
@Entity()
export class ExcerptName extends Base {
  constructor(values?: Partial<ExcerptName>) {
    super();
    Object.assign(this, values);
  }

  /**
   * name.
   */
  @Index({ fulltext: true })
  @Column()
  name: string;

  /**
   * excerpt.
   */
  @ManyToOne(() => Excerpt, (excerpt) => excerpt.names)
  excerpt: Excerpt;
}
