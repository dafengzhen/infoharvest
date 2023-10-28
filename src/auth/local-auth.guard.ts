import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard.
 *
 * @author dafengzhen
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
