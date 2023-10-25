import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

/**
 * Base,
 *
 * @author dafengzhen
 */
export abstract class Base {
  protected constructor(partial?: Partial<Base>) {
    Object.assign(this, partial);
  }

  /**
   * id.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * createDate.
   */
  @CreateDateColumn()
  createDate: string;

  /**
   * updateDate.
   */
  @UpdateDateColumn()
  updateDate: string;

  /**
   * deleteDate.
   */
  @DeleteDateColumn()
  deleteDate: string;

  /**
   * version.
   */
  @VersionColumn()
  version: number;
}
