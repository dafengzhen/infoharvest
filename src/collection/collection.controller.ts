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
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Response as Res } from 'express';
import { Public } from '../auth/public-auth.guard';

/**
 * CollectionController,
 *
 * @author dafengzhen
 */
@Controller('collections')
export class CollectionController {
  private readonly logger = new Logger(CollectionController.name);

  constructor(private readonly collectionService: CollectionService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Response() response: Res,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    this.logger.debug(
      `Create collection => ${JSON.stringify(createCollectionDto)}`,
    );
    const collection = await this.collectionService.create(createCollectionDto);
    response.header('Location', `/collections/${collection.id}`).send();
  }

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll() {
    this.logger.debug(`FindAll collection => `);
    return this.collectionService.findAll();
  }

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number) {
    this.logger.debug(`FindOne collection => ${id}`);
    return this.collectionService.findOne(+id);
  }

  @Public()
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: number,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    this.logger.debug(
      `Update collection => ${JSON.stringify(updateCollectionDto)}`,
    );
    return this.collectionService.update(+id, updateCollectionDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: number) {
    this.logger.debug(`Remove collection => ${id}`);
    return this.collectionService.remove(+id);
  }
}
