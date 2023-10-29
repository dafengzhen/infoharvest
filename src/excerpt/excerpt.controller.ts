import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { ExcerptService } from './excerpt.service';
import { CreateExcerptDto } from './dto/create-excerpt.dto';
import { UpdateExcerptDto } from './dto/update-excerpt.dto';
import { Response as Res } from 'express';
import { PaginationQueryExcerptDto } from './dto/pagination-query-excerpt.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { SearchExcerptDto } from './dto/search-excerpt.dto';

/**
 * ExcerptController,
 *
 * @author dafengzhen
 */
@Controller('excerpts')
export class ExcerptController {
  private readonly logger = new Logger(ExcerptController.name);

  constructor(private readonly excerptService: ExcerptService) {
    this.logger.debug('ExcerptController init');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Response() response: Res,
    @CurrentUser() user: User,
    @Body() createExcerptDto: CreateExcerptDto,
  ) {
    const excerpt = await this.excerptService.create(user, createExcerptDto);
    response.header('Location', `/excerpts/${excerpt.id}`).send();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('search')
  search(@CurrentUser() user: User, @Query() query: SearchExcerptDto) {
    return this.excerptService.search(user, query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query()
    query: PaginationQueryExcerptDto,
  ) {
    return this.excerptService.findAll(user, query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.excerptService.findOne(+id, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body() updateExcerptDto: UpdateExcerptDto,
  ) {
    return this.excerptService.update(+id, user, updateExcerptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() user: User) {
    return this.excerptService.remove(+id, user);
  }
}
