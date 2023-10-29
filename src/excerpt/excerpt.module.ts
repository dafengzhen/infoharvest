import { Module } from '@nestjs/common';
import { ExcerptService } from './excerpt.service';
import { ExcerptController } from './excerpt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Excerpt } from './entities/excerpt.entity';
import { Collection } from '../collection/entities/collection.entity';
import { History } from '../history/entities/history.entity';
import { ExcerptName } from './entities/excerpt-name.entity';
import { ExcerptLink } from './entities/excerpt-link.entity';
import { ExcerptState } from './entities/excerpt-state.entity';

/**
 * ExcerptModule,
 *
 * @author dafengzhen
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collection,
      Excerpt,
      ExcerptName,
      ExcerptLink,
      ExcerptState,
      History,
    ]),
  ],
  controllers: [ExcerptController],
  providers: [ExcerptService],
})
export class ExcerptModule {}
