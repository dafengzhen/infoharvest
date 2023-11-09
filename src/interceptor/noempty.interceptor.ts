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
        this.removeNullAndUndefinedValues(data);
        return data;
      }),
    );
  }

  private removeNullAndUndefinedValues(data: Record<string, any> | any[]) {
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        data.forEach((item) => this.removeNullAndUndefinedValues(item));
      } else {
        for (const key in data) {
          const value = data[key];
          if (value === null || value === undefined) {
            delete data[key];
          } else if (typeof value === 'object') {
            this.removeNullAndUndefinedValues(value);
          }
        }
      }
    }
  }
}
