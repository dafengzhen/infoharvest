import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Collection } from '../../collection/entities/collection.entity';
import { Excerpt } from '../../excerpt/entities/excerpt.entity';
import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { History } from '../../history/entities/history.entity';
import { CustomizationSettings } from './customization-settings';

/**
 * User,
 *
 * @author dafengzhen
 */
@Entity()
export class User extends Base {
  /**
   * username.
   */
  @IsNotEmpty()
  @Column({ unique: true })
  username: string;

  /**
   * password.
   */
  @IsNotEmpty()
  @Exclude()
  @Column()
  password: string;

  /**
   * avatar.
   */
  @Column({ default: null })
  avatar: string;

  /**
   * example.
   */
  @Column({ default: false })
  example: boolean;

  /**
   * collections.
   */
  @OneToMany(() => Collection, (collection) => collection.user, {
    cascade: true,
  })
  collections: Collection[];

  /**
   * excerpts.
   */
  @OneToMany(() => Excerpt, (excerpt) => excerpt.user)
  excerpts: Excerpt[];

  /**
   * histories.
   */
  @OneToMany(() => History, (history) => history.user, { cascade: ['remove'] })
  histories: History[];

  /**
   * customizationSettings.
   */
  @Column({ type: 'json' })
  customizationSettings: CustomizationSettings = new CustomizationSettings();

  constructor(
    values?: Partial<
      Pick<
        User,
        | 'id'
        | 'username'
        | 'password'
        | 'avatar'
        | 'example'
        | 'createDate'
        | 'updateDate'
      >
    >,
  ) {
    super();
    Object.assign(this, values);
  }
}
