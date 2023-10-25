import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, Length } from 'class-validator';

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
  oldPassword?: string;

  /**
   * newPassword.
   */
  @Length(6, 18)
  @IsOptional()
  newPassword?: string;
}
