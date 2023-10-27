import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

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
  @Exclude()
  @DeleteDateColumn()
  deleteDate: string;

  /**
   * version.
   */
  @Exclude()
  @VersionColumn()
  version: number;
}
