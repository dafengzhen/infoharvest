import { Base } from '../../common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Excerpt } from '../../excerpt/entities/excerpt.entity';

/**
 * Collection,
 *
 * @author dafengzhen
 */
@Entity()
export class Collection extends Base {
  constructor(partial?: Partial<Collection>) {
    super();
    Object.assign(this, partial);
  }

  /**
   * name.
   */
  @Column()
  name: string;

  /**
   * subsetName.
   */
  @Column({ type: 'json' })
  subsetName: string[];

  /**
   * sort.
   */
  @Column({ default: 0 })
  sort: number;

  /**
   * user.
   */
  @ManyToOne(() => User, (user) => user.collections)
  user: User;

  /**
   * excerpts.
   */
  @OneToMany(() => Excerpt, (excerpt) => excerpt.collection, {
    cascade: true,
  })
  excerpts: Excerpt[];
}
