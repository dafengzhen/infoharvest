import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Collection } from '../../collection/entities/collection.entity';
import { User } from '../../user/entities/user.entity';
import { ExcerptName } from './excerpt-name.entity';
import { ExcerptLink } from './excerpt-link.entity';
import { ExcerptState } from './excerpt-state.entity';

/**
 * ExcerptStateEnum,
 */
export enum ExcerptStateEnum {
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
      Pick<Excerpt, 'icon' | 'description' | 'sort' | 'enableHistoryLogging'>
    >,
  ) {
    super();
    Object.assign(this, values);
  }

  /**
   * names.
   */
  @OneToMany(() => ExcerptName, (excerptName) => excerptName.excerpt, {
    cascade: true,
  })
  names: ExcerptName[];

  /**
   * links.
   */
  @OneToMany(() => ExcerptLink, (excerptLink) => excerptLink.excerpt, {
    cascade: true,
  })
  links: ExcerptLink[];

  /**
   * states.
   */
  @OneToMany(() => ExcerptState, (excerptState) => excerptState.excerpt, {
    cascade: true,
  })
  states: ExcerptState[];

  /**
   * icon.
   */
  @Column({ type: 'text', default: null })
  icon: string;

  /**
   * description.
   */
  @Index({ fulltext: true, parser: 'ngram' })
  @Column({ type: 'text', default: null })
  description: string;

  /**
   * sort.
   */
  @Column({ default: 0 })
  sort: number;

  /**
   * enableHistoryLogging.
   */
  @Column({ default: false })
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
