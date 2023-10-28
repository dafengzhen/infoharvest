import { Module } from '@nestjs/common';
import { ExcerptService } from './excerpt.service';
import { ExcerptController } from './excerpt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Excerpt } from './entities/excerpt.entity';
import { Collection } from '../collection/entities/collection.entity';
import { History } from '../history/entities/history.entity';

/**
 * ExcerptModule,
 *
 * @author dafengzhen
 */
@Module({
  imports: [TypeOrmModule.forFeature([Excerpt, History, Collection])],
  controllers: [ExcerptController],
  providers: [ExcerptService],
})
export class ExcerptModule {}
