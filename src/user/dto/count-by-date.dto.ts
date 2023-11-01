import { IsNumber, IsOptional, IsPositive, Max } from 'class-validator';

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
  @Max(90)
  @IsOptional()
  @IsPositive()
  @IsNumber()
  pastDays: number;
}
