import { Entity, ManyToOne } from 'typeorm';
import { Excerpt } from '../../excerpt/entities/excerpt.entity';

/**
 * History,
 *
 * @author dafengzhen
 */
@Entity()
export class History extends Excerpt {
  constructor(partial?: Partial<History>) {
    super();
    Object.assign(this, partial);
  }

  /**
   * excerpt.
   */
  @ManyToOne(() => Excerpt)
  excerpt: Excerpt;
}
