import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { QueryHistoryDto } from './dto/query-history.dto';
import { User } from '../user/entities/user.entity';

/**
 * HistoryService
 *
 * @author dafengzhen
 */
@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async findAll(user: User, query: QueryHistoryDto) {
    return this.historyRepository.find({
      where: {
        excerpt: {
          id: query.excerptId,
        },
        user: {
          id: user.id,
        },
      },
      relations: {
        collection: true,
      },
    });
  }

  findOne(id: number, user: User) {
    return this.historyRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
      relations: {
        excerpt: true,
      },
    });
  }

  async remove(id: number, user: User) {
    const history = await this.historyRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });
    await this.historyRepository.remove(history);
  }

  async removeAll(query: QueryHistoryDto, user: User) {
    const histories = await this.historyRepository.find({
      where: {
        excerpt: {
          id: query.excerptId,
        },
        user: {
          id: user.id,
        },
      },
    });
    await this.historyRepository.remove(histories);
  }
}
