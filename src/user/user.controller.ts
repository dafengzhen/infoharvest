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

  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.debug(`Create user => ${createUserDto.username}`);
    return this.userService.create(createUserDto);
  }

  @Public()
  @Get('countByDate')
  getUsersCountByDate() {
    this.logger.debug(`GetUsersCountByDate => `);
    return this.userService.getUsersCountByDate();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    this.logger.debug(`Find user => ${id}`);
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    this.logger.debug(`Update user => ${id}`);
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.logger.debug(`Remove user => ${id}`);
    return this.userService.remove(+id);
  }
}
