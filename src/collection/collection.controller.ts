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
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Response as Res } from 'express';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/entities/user.entity';

/**
 * CollectionController,
 *
 * @author dafengzhen
 */
@Controller('collections')
export class CollectionController {
  private readonly logger = new Logger(CollectionController.name);

  constructor(private readonly collectionService: CollectionService) {
    this.logger.debug('CollectionController init');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Response() response: Res,
    @CurrentUser() user: User,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    const collection = await this.collectionService.create(
      user,
      createCollectionDto,
    );
    response.header('Location', `/collections/${collection.id}`).send();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@CurrentUser() user: User, @Query() query: PaginationQueryDto) {
    return this.collectionService.findAll(user, query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.collectionService.findOne(+id, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionService.update(+id, user, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() user: User) {
    return this.collectionService.remove(+id, user);
  }

  @Delete()
  removeAll(@CurrentUser() user: User) {
    return this.collectionService.removeAll(user);
  }
}
