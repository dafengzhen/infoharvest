/**
 * SelectCollectionDto,
 *
 * @author dafengzhen
 */
export class SelectCollectionDto {
  constructor(values?: Partial<SelectCollectionDto>) {
    Object.assign(this, values);
  }

  /**
   * id.
   */
  id: number;

  /**
   * name.
   */
  name: string;

  /**
   * excerptCount.
   */
  excerptCount?: number;

  /**
   * subset.
   */
  subset: SelectCollectionDto[];
}
