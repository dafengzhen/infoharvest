import { Column, Entity, ManyToOne } from 'typeorm';
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
      this.hNames = values.names.map((value) => value.name);
      this.hLinks = values.links.map((value) => value.link);
      this.hStates = values.states.map((value) => value.state);
      this.excerpt = values as Excerpt;
    }
  }

  /**
   * names.
   */
  @Column({ type: 'json' })
  hNames: string[];

  /**
   * links.
   */
  @Column({ type: 'json' })
  hLinks: string[];

  /**
   * states.
   */
  @Column({ type: 'json' })
  hStates: string[];

  /**
   * excerpt.
   */
  @ManyToOne(() => Excerpt)
  excerpt: Excerpt;
}
