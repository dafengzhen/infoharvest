import { Injectable } from '@nestjs/common';
import { CreateExcerptDto } from './dto/create-excerpt.dto';
import { UpdateExcerptDto } from './dto/update-excerpt.dto';

@Injectable()
export class ExcerptService {
  create(createExcerptDto: CreateExcerptDto) {
    return 'This action adds a new excerpt';
  }

  findAll() {
    return `This action returns all excerpt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} excerpt`;
  }

  update(id: number, updateExcerptDto: UpdateExcerptDto) {
    return `This action updates a #${id} excerpt`;
  }

  remove(id: number) {
    return `This action removes a #${id} excerpt`;
  }
}
