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
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    const collection = await this.collectionService.create(createCollectionDto);
    response.header('Location', `/collections/${collection.id}`).send();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.collectionService.findAll(query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.collectionService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: number,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionService.update(+id, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.collectionService.remove(+id);
  }

  @Delete()
  removeAll() {
    return this.collectionService.removeAll();
  }
}
