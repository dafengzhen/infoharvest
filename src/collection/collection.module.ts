import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';

/**
 * CollectionModule,
 *
 * @author dafengzhen
 */
@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
