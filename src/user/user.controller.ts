import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post, Put, Query, Response, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/public-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './entities/user.entity';
import { CountByDateDto } from './dto/count-by-date.dto';
import { UpdateCustomizationSettingsUserDto } from './dto/update-customization-settings-user.dto';
import { Response as Res } from 'express';
import { getMaxAge, isHttpsSite } from '../common/tool/tool';
import { SECURE_TK, TK } from '../constants';

/**
 * UserController,
 *
 * @author dafengzhen
 */
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {
    this.logger.debug('UserController init');
  }

  @Public()
  @Post()
  async create(
    @Response() response: Res,
    @Body() createUserDto: CreateUserDto,
  ) {
    const vo = await this.userService.create(createUserDto);
    const _isHttpsSite = isHttpsSite();

    response
      .cookie(_isHttpsSite ? SECURE_TK : TK, vo.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: _isHttpsSite,
        maxAge: getMaxAge(vo.expDays),
      })
      .header('Location', `/users/${vo.id}`)
      .send(vo);
  }

  @Public()
  @Get('countByDate')
  getUsersCountByDate(@Query() query: CountByDateDto) {
    return this.userService.getUsersCountByDate(query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return this.userService.getProfile(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.userService.findOne(id, user);
  }

  @Put(':id/customization-settings')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateCustomizationSettings(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body()
    updateCustomizationSettingsUserDto: UpdateCustomizationSettingsUserDto,
  ) {
    return this.userService.updateCustomizationSettings(
      id,
      user,
      updateCustomizationSettingsUserDto,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, user, updateUserDto);
  }

  @Delete()
  remove(@CurrentUser() user: User) {
    return this.userService.remove(user);
  }
}
