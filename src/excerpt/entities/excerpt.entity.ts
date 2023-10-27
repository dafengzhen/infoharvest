import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Collection } from '../../collection/entities/collection.entity';
import { User } from '../../user/entities/user.entity';

export enum ExcerptState {
  VALID = 'VALID',
  INVALID = 'INVALID',
  UNCONFIRMED = 'UNCONFIRMED',
}

/**
 * Excerpt,
 *
 * @author dafengzhen
 */
@Entity()
export class Excerpt extends Base {
  constructor(
    values?: Partial<
      Pick<Excerpt, 'description' | 'sort' | 'enableHistoryLogging'>
    >,
  ) {
    super();
    Object.assign(this, values);
  }

  /**
   * names.
   */
  @Column({ type: 'json' })
  names: string[];

  /**
   * selectedSubsetName.
   */
  @Column({ type: 'json' })
  selectedSubsetName: string[];

  /**
   * links.
   */
  @Column({ type: 'json' })
  links: string[];

  /**
   * states.
   */
  @Column({ type: 'json' })
  states: string[];

  /**
   * description.
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * sort.
   */
  @Column({ default: 0 })
  sort: number = 0;

  /**
   * enableHistoryLogging.
   */
  @Column({ default: true })
  enableHistoryLogging: boolean;

  /**
   * user.
   */
  @ManyToOne(() => User, (user) => user.excerpts)
  user: User;

  /**
   * collection.
   */
  @ManyToOne(() => Collection, (collection) => collection.excerpts)
  collection: Collection;
}
