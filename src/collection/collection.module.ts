import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Excerpt } from '../excerpt/entities/excerpt.entity';
import { ExcerptName } from '../excerpt/entities/excerpt-name.entity';
import { ExcerptLink } from '../excerpt/entities/excerpt-link.entity';
import { ExcerptState } from '../excerpt/entities/excerpt-state.entity';
import { History } from '../history/entities/history.entity';

/**
 * CollectionModule,
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
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
