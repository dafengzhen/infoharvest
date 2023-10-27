import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

/**
 * NoEmptyInterceptor,
 *
 * @author dafengzhen
 */
export class NoEmptyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'object') {
          for (const key in data) {
            const value = data[key];
            if (value === null || value === undefined) {
              delete data[key];
            }
          }
        }
        return data;
      }),
    );
  }
}
