import { Injectable } from '@nestjs/common';
import { CreateExcerptDto } from './dto/create-excerpt.dto';
import { UpdateExcerptDto } from './dto/update-excerpt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Excerpt } from './entities/excerpt.entity';
import { Collection } from '../collection/entities/collection.entity';
import { Paginate } from '../common/tool/pagination';
import { PaginationQueryExcerptDto } from './dto/pagination-query-excerpt.dto';
import { History } from '../history/entities/history.entity';
import { User } from '../user/entities/user.entity';
import { ExcerptName } from './entities/excerpt-name.entity';
import { ExcerptLink } from './entities/excerpt-link.entity';
import { ExcerptState } from './entities/excerpt-state.entity';
import { SearchExcerptDto } from './dto/search-excerpt.dto';
import { isHttpOrHttps, mapToArray, mergeAndDistinctArrays, mergeObjects } from '../common/tool/tool';
import { CheckLinkValidityDto } from './dto/check-link-validity.dto';
import { load } from 'cheerio';

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

  async checkLinkValidity(checkLinkValidityDto: CheckLinkValidityDto) {
    const { links = [], headers = {} } = checkLinkValidityDto;
    const _links = links
      .map((item) => item.trim())
      .filter((item) => isHttpOrHttps(item));
    const result = new Map<
      string,
      {
        link: string;
        ok: boolean;
        status?: number;
        statusText?: string;
        message?: string;
        contentType?: string;
        data?: any;
        title?: string;
        description?: string;
      }
    >();

    if (_links.length === 0) {
      return [];
    }

    for (let i = 0; i < _links.length; i++) {
      const link = _links[i];
      try {
        const response = await fetch(link, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            ...headers,
          },
        });
        if (!response.ok) {
          result.set(link, {
            link,
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
          });
          continue;
        }

        if (!this.validateStatus(response.status)) {
          result.set(link, {
            link,
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
          });
          continue;
        }

        const contentType = response.headers.get('content-type');
        if (contentType.includes('application/json')) {
          result.set(link, {
            link,
            ok: true,
            status: response.status,
            statusText: response.statusText,
            contentType,
            data: await response.json(),
          });
        } else if (contentType.includes('text/html')) {
          let html = await response.text();
          if (typeof html !== 'string') {
            html = '';
          }

          const $ = load(html);
          const title = $('head > title').text();
          const description = $('meta[name="description"]').attr('content');

          result.set(link, {
            link,
            ok: true,
            status: response.status,
            statusText: response.statusText,
            contentType,
            title,
            description,
          });
        } else {
          result.set(link, {
            link,
            ok: true,
            status: response.status,
            statusText: response.statusText,
            contentType,
          });
        }
      } catch (error) {
        result.set(link, {
          link,
          ok: false,
          message: error?.message ?? 'Unknown Error',
        });
      }
    }

    return mapToArray(result);
  }

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
      excerpt.icon = icon;
    }

    if (typeof description === 'string') {
      excerpt.description = description;
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
    excerpt.states = states.map(
      (state) => new ExcerptState({ state, excerpt }),
    );

    if (
      typeof collectionId === 'number' &&
      (await this.collectionRepository.exists({ where: { id: collectionId } }))
    ) {
      excerpt.collection = await this.collectionRepository.findOneByOrFail({
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
      (await this.collectionRepository.exists({
        where: { id: collectionId, user: { id: user.id } },
      }))
    ) {
      qb.where('excerpt.collection = :collectionId', {
        collectionId: query.collectionId,
      });
    }

    const _query = { ...query };
    delete _query.collectionId;
    if (Object.values(_query).every((value) => typeof value === 'undefined')) {
      return qb.getMany();
    } else {
      return Paginate<Excerpt>(qb, query);
    }
  }

  findOne(id: number, user: User) {
    return this.excerptRepository.findOneOrFail({
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const excerpt = await this.excerptRepository.findOneOrFail({
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
        names = [],
        states = [],
        links = [],
        collectionId,
        deleteCollection,
      } = updateExcerptDto;

      if (typeof icon === 'string') {
        excerpt.icon = icon;
      }

      if (typeof description === 'string') {
        excerpt.description = description;
      }

      if (typeof sort === 'number') {
        excerpt.sort = sort;
      }

      let isUpdateHistory = excerpt.enableHistoryLogging ?? false;
      if (typeof enableHistoryLogging === 'boolean') {
        excerpt.enableHistoryLogging = enableHistoryLogging;
        isUpdateHistory = enableHistoryLogging;
      }

      if (Array.isArray(names)) {
        const deletedItems = [];
        excerpt.names = mergeAndDistinctArrays(excerpt.names ?? [], names, [
          'name',
          'sort',
          'deletionFlag',
        ])
          .filter((item) => {
            const value = !item.deletionFlag;
            if (!value) {
              deletedItems.push(item);
            }
            return value;
          })
          .map((item) => {
            delete item.deletionFlag;

            if (typeof item.id !== 'number' && typeof item.name === 'string') {
              const _item = mergeObjects(new ExcerptName(), item, [
                'name',
                'sort',
              ]) as ExcerptName;
              _item.excerpt = item.excerpt;
              return _item;
            }
            return item;
          });

        for (let i = 0; i < deletedItems.length; i++) {
          const item = deletedItems[i];
          await this.excerptNameRepository.remove(item);
        }
      }

      if (Array.isArray(links)) {
        const deletedItems = [];
        excerpt.links = mergeAndDistinctArrays(excerpt.links ?? [], links, [
          'link',
          'sort',
          'deletionFlag',
        ])
          .filter((item) => {
            const value = !item.deletionFlag;
            if (!value) {
              deletedItems.push(item);
            }
            return value;
          })
          .map((item) => {
            delete item.deletionFlag;

            if (typeof item.id !== 'number' && typeof item.name === 'string') {
              const _item = mergeObjects(new ExcerptLink(), item, [
                'link',
                'sort',
              ]) as ExcerptLink;
              _item.excerpt = item.excerpt;
              return _item;
            }
            return item;
          });

        for (let i = 0; i < deletedItems.length; i++) {
          const item = deletedItems[i];
          await this.excerptLinkRepository.remove(item);
        }
      }

      if (Array.isArray(states)) {
        const deletedItems = [];
        excerpt.states = mergeAndDistinctArrays(excerpt.states ?? [], states, [
          'state',
          'sort',
          'deletionFlag',
        ])
          .filter((item) => {
            const value = !item.deletionFlag;
            if (!value) {
              deletedItems.push(item);
            }
            return value;
          })
          .map((item) => {
            delete item.deletionFlag;

            if (typeof item.id !== 'number' && typeof item.name === 'string') {
              const _item = mergeObjects(new ExcerptState(), item, [
                'state',
                'sort',
              ]) as ExcerptState;
              _item.excerpt = item.excerpt;
              return _item;
            }
            return item;
          });

        for (let i = 0; i < deletedItems.length; i++) {
          const item = deletedItems[i];
          await this.excerptStateRepository.remove(item);
        }
      }

      if (
        typeof collectionId === 'number' &&
        (await this.collectionRepository.exists({
          where: {
            id: collectionId,
            user: {
              id: user.id,
            },
          },
        }))
      ) {
        excerpt.collection = await this.collectionRepository.findOneByOrFail({
          id: collectionId,
        });
      } else if (typeof deleteCollection === 'boolean' && deleteCollection) {
        excerpt.collection = null;
      }

      const savedExcerpt = await this.excerptRepository.save(excerpt);
      if (isUpdateHistory) {
        await this.historyRepository.save(new History(savedExcerpt));
      }

      //
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const excerpt = await this.excerptRepository.findOneOrFail({
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

  private validateStatus(status) {
    return status >= 200 && status < 300;
  }
}
