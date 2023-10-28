import { Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public-auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { User } from '../user/entities/user.entity';
import { TokenVo } from '../user/vo/token.vo';

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
  async login(@CurrentUser() user: User) {
    return new TokenVo({
      id: user.id,
      username: user.username,
      token: await this.authService.getTokenForUser(user),
    });
  }
}
