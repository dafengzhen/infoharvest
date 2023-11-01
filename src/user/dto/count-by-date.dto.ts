import { IsNumber, IsOptional, IsPositive } from 'class-validator';

/**
 * CountByDateDto,
 *
 * @author dafengzhen
 */
export class CountByDateDto {
  constructor(values?: Partial<CountByDateDto>) {
    Object.assign(this, values);
  }

  /**
   * pastDays.
   */
  @IsOptional()
  @IsPositive()
  @IsNumber()
  pastDays: number;
}
