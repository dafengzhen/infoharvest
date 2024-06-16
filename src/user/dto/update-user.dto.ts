import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  @IsString()
  oldPassword?: string;

  /**
   * newPassword.
   */
  @IsOptional()
  @IsString()
  newPassword?: string;

  /**
   * avatar.
   */
  @IsOptional()
  @IsString()
  avatar: string;
}
