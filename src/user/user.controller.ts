import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/public-auth.guard';

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Get('countByDate')
  getUsersCountByDate() {
    return this.userService.getUsersCountByDate();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }
}
