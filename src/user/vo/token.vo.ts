/**
 * TokenVo,
 *
 * @author dafengzhen
 */
export class TokenVo {
  constructor(vo: TokenVo) {
    Object.assign(this, vo);
  }

  /**
   * id.
   */
  id: number;

  /**
   * username.
   */
  username: string;

  /**
   * token.
   */
  token: string;

  /**
   * expDays
   */
  expDays: number;
}
