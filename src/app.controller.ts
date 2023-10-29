import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public-auth.guard';
import { CurrentUser } from './auth/current-user.decorator';
import { User } from './user/entities/user.entity';
import { ImportDataDto } from './common/dto/import-data.dto';

/**
 * AppController.
 *
 * @author dafengzhen
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  health() {
    return this.appService.health();
  }

  @Post('export')
  export(@CurrentUser() user: User) {
    return this.appService.export(user);
  }

  @Post('import')
  @HttpCode(HttpStatus.NO_CONTENT)
  import(@CurrentUser() user: User, @Body() importDataDto: ImportDataDto) {
    return this.appService.import(user, importDataDto);
  }
}
