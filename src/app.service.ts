import { Injectable } from '@nestjs/common';

/**
 * AppService.
 *
 * @author dafengzhen
 */
@Injectable()
export class AppService {
  health() {
    return {
      status: 'UP',
    };
  }
}
