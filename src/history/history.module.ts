import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';

/**
 * HistoryModule
 *
 * @author dafengzhen
 */
@Module({
  imports: [TypeOrmModule.forFeature([History])],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
