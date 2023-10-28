import { Entity, ManyToOne } from 'typeorm';
import { Excerpt } from '../../excerpt/entities/excerpt.entity';

/**
 * History,
 *
 * @author dafengzhen
 */
@Entity()
export class History extends Excerpt {
  constructor(values?: Partial<Excerpt>) {
    super();
    if (values) {
      this.names = values.names;
      this.links = values.links;
      this.states = values.states;
      this.description = values.description;
      this.sort = values.sort;
      this.enableHistoryLogging = values.enableHistoryLogging;
      this.user = values.user;
      this.collection = values.collection;
      this.excerpt = values as Excerpt;
    }
  }

  /**
   * excerpt.
   */
  @ManyToOne(() => Excerpt)
  excerpt: Excerpt;
}
