import { Injectable } from '@nestjs/common';
import { CreateExcerptDto } from './dto/create-excerpt.dto';
import { UpdateExcerptDto } from './dto/update-excerpt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Excerpt, ExcerptStateEnum } from './entities/excerpt.entity';
import { Collection } from '../collection/entities/collection.entity';
import { Paginate } from '../common/tool/pagination';
import { PaginationQueryExcerptDto } from './dto/pagination-query-excerpt.dto';
import { History } from '../history/entities/history.entity';
import { User } from '../user/entities/user.entity';
import { ExcerptName } from './entities/excerpt-name.entity';
import { ExcerptLink } from './entities/excerpt-link.entity';
import { ExcerptState } from './entities/excerpt-state.entity';
import { SearchExcerptDto } from './dto/search-excerpt.dto';

/**
 * ExcerptService,
 *
 * @author dafengzhen
 */
@Injectable()
export class ExcerptService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,

    @InjectRepository(Excerpt)
    private readonly excerptRepository: Repository<Excerpt>,

    @InjectRepository(ExcerptName)
    private readonly excerptNameRepository: Repository<ExcerptName>,

    @InjectRepository(ExcerptLink)
    private readonly excerptLinkRepository: Repository<ExcerptLink>,

    @InjectRepository(ExcerptState)
    private readonly excerptStateRepository: Repository<ExcerptState>,

    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,

    private readonly dataSource: DataSource,
  ) {}

  async create(user: User, createExcerptDto: CreateExcerptDto) {
    const {
      icon,
      description,
      sort,
      enableHistoryLogging,
      names = [],
      links = [],
      states = [],
      collectionId,
    } = createExcerptDto;
    const excerpt = new Excerpt();
    excerpt.user = user;

    if (typeof icon === 'string') {
      excerpt.icon = icon.trim();
    }

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

    excerpt.names = names.map((name) => new ExcerptName({ name, excerpt }));
    excerpt.links = links.map((link) => new ExcerptLink({ link, excerpt }));
    excerpt.states =
      states.length === 0
        ? [new ExcerptState({ state: ExcerptStateEnum.VALID, excerpt })]
        : states.map((state) => new ExcerptState({ state, excerpt }));

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

  search(user: User, query: SearchExcerptDto) {
    const name = decodeURIComponent(query.name);
    return this.excerptRepository
      .createQueryBuilder('excerpt')
      .leftJoinAndSelect('excerpt.names', 'names')
      .leftJoinAndSelect('excerpt.links', 'links')
      .leftJoinAndSelect('excerpt.states', 'states')
      .leftJoinAndSelect('excerpt.collection', 'collection')
      .orWhere('MATCH(names.name) AGAINST (:name IN BOOLEAN MODE)', { name })
      .orWhere('MATCH(links.link) AGAINST (:name IN BOOLEAN MODE)', { name })
      .orWhere('MATCH(states.state) AGAINST (:name IN BOOLEAN MODE)', { name })
      .orWhere('MATCH(excerpt.description) AGAINST (:name IN BOOLEAN MODE)', {
        name,
      })
      .andWhere('excerpt.user = :userId', { userId: user.id })
      .addOrderBy('excerpt.id', 'DESC')
      .getMany();
  }

  async findAll(user: User, query: PaginationQueryExcerptDto) {
    const qb = this.excerptRepository
      .createQueryBuilder('excerpt')
      .leftJoinAndSelect('excerpt.names', 'names')
      .leftJoinAndSelect('excerpt.links', 'links')
      .leftJoinAndSelect('excerpt.states', 'states')
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
        names: true,
        links: true,
        states: true,
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
        names: true,
        links: true,
        states: true,
        user: true,
        collection: true,
      },
    });
    const {
      icon,
      description,
      sort,
      enableHistoryLogging,
      names,
      states,
      links,
      collectionId,
    } = updateExcerptDto;

    if (typeof icon === 'string') {
      excerpt.icon = icon.trim();
    }

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
      excerpt.states = states.map(
        (state) => new ExcerptState({ state, excerpt }),
      );
    }

    if (Array.isArray(links)) {
      excerpt.links = links.map((link) => new ExcerptLink({ link, excerpt }));
    }

    if (Array.isArray(names) && names.length > 0) {
      excerpt.names = names.map((name) => new ExcerptName({ name, excerpt }));
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const excerpt = await this.excerptRepository.findOne({
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
        },
      });

      // histories
      await this.historyRepository.remove(
        await this.historyRepository.find({
          where: {
            excerpt: {
              id: excerpt.id,
            },
            user: {
              id: user.id,
            },
          },
        }),
      );

      // excerpt
      await this.excerptNameRepository.remove(excerpt.names);
      await this.excerptLinkRepository.remove(excerpt.links);
      await this.excerptStateRepository.remove(excerpt.states);
      await this.excerptRepository.remove(excerpt);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
