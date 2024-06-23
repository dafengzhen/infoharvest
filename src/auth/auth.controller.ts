import { Controller, Logger, Post, Response, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public-auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { User } from '../user/entities/user.entity';
import { TokenVo } from '../user/vo/token.vo';
import { Response as Res } from 'express';
import { getMaxAge, isHttpsSite } from '../common/tool/tool';
import { EXP_DAYS, SECURE_TK, TK } from '../constants';

/**
 * AuthController.
 *
 * @author dafengzhen
 */
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {
    this.logger.debug('AuthController init');
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Response() response: Res, @CurrentUser() user: User) {
    const vo = new TokenVo({
      id: user.id,
      username: user.username,
      token: await this.authService.getTokenForUser(user),
      expDays: EXP_DAYS,
    });

    const _isHttpsSite = isHttpsSite();
    response
      .cookie(_isHttpsSite ? SECURE_TK : TK, vo.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: _isHttpsSite,
        maxAge: getMaxAge(vo.expDays),
      })
      .send(vo);
  }
}
