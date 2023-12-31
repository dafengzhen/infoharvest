import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * CreateUserDto,
 *
 * @author dafengzhen
 */
export class CreateUserDto {
  constructor(values?: Partial<CreateUserDto>) {
    Object.assign(this, values);
  }

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
