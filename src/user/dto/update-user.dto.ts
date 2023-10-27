import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, Length } from 'class-validator';

/**
 * UpdateUserDto,
 *
 * @author dafengzhen
 */
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  /**
   * oldPassword.
   */
  @Length(6, 18)
  @IsOptional()
  @IsString()
  oldPassword?: string;

  /**
   * newPassword.
   */
  @Length(6, 18)
  @IsOptional()
  @IsString()
  newPassword?: string;
}
