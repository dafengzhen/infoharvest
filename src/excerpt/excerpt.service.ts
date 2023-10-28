import { Injectable } from '@nestjs/common';
import { CreateExcerptDto } from './dto/create-excerpt.dto';
import { UpdateExcerptDto } from './dto/update-excerpt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Excerpt, ExcerptState } from './entities/excerpt.entity';
import { Collection } from '../collection/entities/collection.entity';
import { Paginate } from '../common/tool/pagination';
import { PaginationQueryExcerptDto } from './dto/pagination-query-excerpt.dto';
import { History } from '../history/entities/history.entity';
import { User } from '../user/entities/user.entity';

/**
 * ExcerptService,
 *
 * @author dafengzhen
 */
@Injectable()
export class ExcerptService {
  constructor(
    @InjectRepository(Excerpt)
    private readonly excerptRepository: Repository<Excerpt>,

    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,

    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async create(user: User, createExcerptDto: CreateExcerptDto) {
    const {
      description,
      sort,
      enableHistoryLogging,
      names = [],
      states = [],
      links = [],
      collectionId,
    } = createExcerptDto;
    const excerpt = new Excerpt();
    excerpt.user = user;

    if (typeof description === 'string') {
      excerpt.description = description.trim();
    }

    if (typeof sort === 'number') {
      excerpt.sort = sort;
    }

    let isCreateHistory = false;
    if (typeof enableHistoryLogging === 'boolean') {
      excerpt.enableHistoryLogging = enableHistoryLogging;
      isCreateHistory = enableHistoryLogging;
    }

    excerpt.names = names;
    excerpt.links = links;
    excerpt.states = states.length === 0 ? [ExcerptState.VALID] : states;

    if (
      typeof collectionId === 'number' &&
      (await this.collectionRepository.exist({ where: { id: collectionId } }))
    ) {
      excerpt.collection = await this.collectionRepository.findOneBy({
        id: collectionId,
      });
    }

    const savedExcerpt = await this.excerptRepository.save(excerpt);
    if (isCreateHistory) {
      await this.historyRepository.save(new History(savedExcerpt));
    }
    return savedExcerpt;
  }

  async findAll(user: User, query: PaginationQueryExcerptDto) {
    const qb = this.excerptRepository
      .createQueryBuilder('excerpt')
      .leftJoinAndSelect('excerpt.collection', 'collection')
      .where('excerpt.user = :userId', {
        userId: user.id,
      })
      .addOrderBy('excerpt.sort', 'DESC')
      .addOrderBy('excerpt.id', 'DESC');

    const collectionId = query.collectionId;
    if (
      typeof collectionId === 'number' &&
      (await this.collectionRepository.exist({
        where: { id: collectionId, user: { id: user.id } },
      }))
    ) {
      qb.where('excerpt.collection = :collectionId', {
        collectionId: query.collectionId,
      });
    } else {
      qb.where('excerpt.collection is null');
    }

    return Paginate<Excerpt>(qb, query);
  }

  findOne(id: number, user: User) {
    return this.excerptRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
      relations: {
        collection: true,
      },
    });
  }

  async update(id: number, user: User, updateExcerptDto: UpdateExcerptDto) {
    const excerpt = await this.excerptRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
      relations: {
        user: true,
        collection: true,
      },
    });
    const {
      description,
      sort,
      enableHistoryLogging,
      names,
      states,
      links,
      collectionId,
    } = updateExcerptDto;

    if (typeof description === 'string') {
      excerpt.description = description.trim();
    }

    if (typeof sort === 'number') {
      excerpt.sort = sort;
    }

    let isUpdateHistory = excerpt.enableHistoryLogging ?? false;
    if (typeof enableHistoryLogging === 'boolean') {
      excerpt.enableHistoryLogging = enableHistoryLogging;
      isUpdateHistory = enableHistoryLogging;
    }

    if (Array.isArray(states)) {
      excerpt.states = states;
    }

    if (Array.isArray(links)) {
      excerpt.links = links;
    }

    if (Array.isArray(names) && names.length > 0) {
      excerpt.names = names;
    }

    if (
      typeof collectionId === 'number' &&
      (await this.collectionRepository.exist({
        where: {
          id: collectionId,
          user: {
            id: user.id,
          },
        },
      }))
    ) {
      excerpt.collection = await this.collectionRepository.findOneBy({
        id: collectionId,
      });
    }

    const savedExcerpt = await this.excerptRepository.save(excerpt);
    if (isUpdateHistory) {
      await this.historyRepository.save(new History(savedExcerpt));
    }

    return savedExcerpt;
  }

  async remove(id: number, user: User) {
    const excerpt = await this.excerptRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });
    await this.excerptRepository.remove(excerpt);
  }
}
