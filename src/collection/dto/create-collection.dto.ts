import { IsNotEmpty, IsString } from 'class-validator';

/**
 * CreateCollectionDto,
 *
 * @author dafengzhen
 */
export class CreateCollectionDto {
  constructor(values?: Partial<CreateCollectionDto>) {
    Object.assign(this, values);
  }

  /**
   * name.
   */
  @IsString()
  @IsNotEmpty()
  name: string;
}
