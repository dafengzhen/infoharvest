import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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

    private readonly dataSource: DataSource,
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
        names: true,
        links: true,
        states: true,
        collection: true,
      },
    });
  }

  findOne(id: number, user: User) {
    return this.historyRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
      relations: {
        names: true,
        links: true,
        states: true,
        excerpt: true,
      },
    });
  }

  async remove(id: number, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const history = await this.historyRepository.findOneOrFail({
        where: {
          id,
          user: {
            id: user.id,
          },
        },
      });
      await this.historyRepository.remove(history);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async removeAll(query: QueryHistoryDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
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
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
