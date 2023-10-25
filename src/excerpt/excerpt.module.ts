import { Module } from '@nestjs/common';
import { ExcerptService } from './excerpt.service';
import { ExcerptController } from './excerpt.controller';

@Module({
  controllers: [ExcerptController],
  providers: [ExcerptService],
})
export class ExcerptModule {}
