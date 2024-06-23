import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { isHttpsSite } from '../common/tool/tool';
import { SECURE_TK, TK } from '../constants';
import { Request as Req } from 'express';

/**
 * JwtStrategy.
 *
 * @author dafengzhen
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET,
    });
  }

  private static extractJWT(req: Req): string | null {
    const key = isHttpsSite() ? SECURE_TK : TK;
    if (typeof req.cookies === 'object') {
      const tk = req.cookies[key];
      if (typeof tk === 'string' && tk.length > 0) {
        return tk;
      }
    }

    return null;
  }

  async validate(payload: any) {
    return this.authService.getTokenForUserId(payload.sub);
  }
}
