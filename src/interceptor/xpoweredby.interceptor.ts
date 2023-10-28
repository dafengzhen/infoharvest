import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * XPoweredByInterceptor,
 *
 * @author dafengzhen
 */
export class XPoweredByInterceptor implements NestInterceptor {
  private readonly xPoweredBy: string;

  constructor(xPoweredBy: string) {
    this.xPoweredBy = xPoweredBy;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    response.header('X-Powered-By', this.xPoweredBy);
    return next.handle();
  }
}
