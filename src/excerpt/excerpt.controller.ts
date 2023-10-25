import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExcerptService } from './excerpt.service';
import { CreateExcerptDto } from './dto/create-excerpt.dto';
import { UpdateExcerptDto } from './dto/update-excerpt.dto';

@Controller('excerpt')
export class ExcerptController {
  constructor(private readonly excerptService: ExcerptService) {}

  @Post()
  create(@Body() createExcerptDto: CreateExcerptDto) {
    return this.excerptService.create(createExcerptDto);
  }

  @Get()
  findAll() {
    return this.excerptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.excerptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExcerptDto: UpdateExcerptDto) {
    return this.excerptService.update(+id, updateExcerptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.excerptService.remove(+id);
  }
}
