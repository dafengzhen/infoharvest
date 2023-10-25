import { IsNotEmpty, Length } from 'class-validator';

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
  username: string;

  /**
   * password.
   */
  @Length(6, 18)
  @IsNotEmpty()
  password: string;
}
