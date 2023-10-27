import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * XPoweredByInterceptor,
 *
 * @author dafengzhen
 */
export class XPoweredByInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    response.header('X-Powered-By', 'infoharvest');
    return next.handle();
  }
}
