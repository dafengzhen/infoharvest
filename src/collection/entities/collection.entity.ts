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
  constructor(values?: Partial<Pick<Collection, 'name' | 'sort'>>) {
    super();
    Object.assign(this, values);
  }

  /**
   * name.
   */
  @Column()
  name: string;

  /**
   * sort.
   */
  @Column({ default: 0 })
  sort: number = 0;

  /**
   * parentSubset.
   */
  @ManyToOne(() => Collection, (collection) => collection.subset, {
    onDelete: 'CASCADE',
  })
  parentSubset: Collection;

  /**
   * subset.
   */
  @OneToMany(() => Collection, (collection) => collection.parentSubset, {
    cascade: true,
  })
  subset: Collection[];

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
