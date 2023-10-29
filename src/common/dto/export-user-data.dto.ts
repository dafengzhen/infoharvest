import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * ExportUserDataDto,
 *
 * @author dafengzhen
 */
export class ExportUserDataDto {
  /**
   /**
   * id.
   */
  @IsNotEmpty()
  @IsNumber()
  id: number;

  /**
   * createDate.
   */
  @IsNotEmpty()
  @IsString()
  createDate: string;

  /**
   * updateDate.
   */
  @IsNotEmpty()
  @IsString()
  updateDate: string;

  /**
   * username.
   */
  @IsNotEmpty()
  @IsString()
  username: string;
}
