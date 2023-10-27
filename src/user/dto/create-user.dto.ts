import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * CreateUserDto,
 *
 * @author dafengzhen
 */
export class CreateUserDto {
  /**
   * username.
   */
  @Length(3, 15)
  @IsNotEmpty()
  @IsString()
  username: string;

  /**
   * password.
   */
  @Length(6, 18)
  @IsNotEmpty()
  @IsString()
  password: string;
}
