import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Paginate } from '../common/tool/pagination';
import { User } from '../user/entities/user.entity';
import { SearchCollectionDto } from './dto/search-collection.dto';
import { Excerpt } from '../excerpt/entities/excerpt.entity';
import { ExcerptName } from '../excerpt/entities/excerpt-name.entity';
import { ExcerptLink } from '../excerpt/entities/excerpt-link.entity';
import { ExcerptState } from '../excerpt/entities/excerpt-state.entity';
import { History } from '../history/entities/history.entity';
import { SelectCollectionDto } from './dto/select-collection.dto';
import { IPagination } from '../common/interface/pagination';

/**
 * CollectionService,
 *
 * @author dafengzhen
 */
@Injectable()
export class CollectionService {
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

  create(user: User, createCollectionDto: CreateCollectionDto) {
    const { name } = createCollectionDto;
    const collection = new Collection({
      name,
    });
    collection.user = user;
    return this.collectionRepository.save(collection);
  }

  search(user: User, query: SearchCollectionDto) {
    const name = decodeURIComponent(query.name);
    return this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.subset', 'subset')
      .where('MATCH(collection.name) AGAINST (:name IN BOOLEAN MODE)', { name })
      .orWhere('MATCH(subset.name) AGAINST (:name IN BOOLEAN MODE)', {
        name,
      })
      .andWhere('collection.user.id = :userId', { userId: user.id })
      .addOrderBy('collection.id', 'DESC')
      .getMany();
  }

  async selectAll(user: User) {
    const collections = (
      await this.collectionRepository
        .createQueryBuilder('collection')
        .leftJoinAndSelect('collection.subset', 'subset')
        .where('collection.parentSubset is null')
        .andWhere('collection.user = :userId', { userId: user.id })
        .addOrderBy('collection.sort', 'DESC')
        .addOrderBy('collection.id', 'DESC')
        .getMany()
    ).map((item) => {
      return new SelectCollectionDto({
        id: item.id,
        name: item.name,
        subset: item.subset.map((value) => {
          return new SelectCollectionDto({
            id: value.id,
            name: value.name,
            subset: value.subset,
          });
        }),
      });
    });

    await this.addExcerptCount(collections);
    return collections;
  }

  async findAll(user: User, query: PaginationQueryDto) {
    const qb = this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.subset', 'subset')
      .where('collection.parentSubset is null')
      .andWhere('collection.user = :userId', { userId: user.id })
      .addOrderBy('collection.sort', 'DESC')
      .addOrderBy('collection.id', 'DESC');

    // 默认查询所有，书签一般不需要分页
    // By default, retrieve all results; pagination is usually not necessary for bookmarks
    let data: Collection[] | IPagination<Collection>;
    if (Object.values(query).every((value) => typeof value === 'undefined')) {
      data = await qb.getMany();
    } else {
      data = await Paginate<Collection>(qb, query);
    }

    await this.addExcerptCount(Array.isArray(data) ? data : data.data);
    return data;
  }

  async findOne(id: number, user: User) {
    return this.collectionRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
      relations: {
        subset: true,
        parentSubset: true,
      },
    });
  }

  async update(
    id: number,
    user: User,
    updateCollectionDto: UpdateCollectionDto,
  ) {
    const { name, sort, subset } = updateCollectionDto;
    const collection = await this.collectionRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
      relations: {
        subset: true,
      },
    });

    const newName = name?.trim();
    if (newName) {
      collection.name = newName;
    }

    if (typeof sort === 'number') {
      collection.sort = sort;
    }

    if (subset && subset.length > 0) {
      const oldSubset = collection.subset ?? [];
      collection.subset = [
        ...subset.map((item) => {
          if (typeof item.id === 'number') {
            const find = oldSubset.find((value) => value.id === item.id);
            if (find) {
              const sort = item.sort;
              const name = item.name?.trim();
              if (name) {
                find.name = name;
              }
              if (typeof sort === 'number') {
                find.sort = sort;
              }
              return find;
            }
          }

          const _item = new Collection(item);
          _item.user = user;
          return _item;
        }),
      ];
    }

    await this.collectionRepository.save(collection);
  }

  async remove(id: number, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const collection = await this.collectionRepository.findOneOrFail({
        where: {
          id,
          user: {
            id: user.id,
          },
        },
        relations: {
          subset: true,
          excerpts: {
            names: true,
            links: true,
            states: true,
          },
        },
      });

      // excerpts
      const excerpts = collection.excerpts;
      for (let i = 0; i < excerpts.length; i++) {
        const excerpt = excerpts[i];
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
        await this.excerptNameRepository.remove(excerpt.names);
        await this.excerptLinkRepository.remove(excerpt.links);
        await this.excerptStateRepository.remove(excerpt.states);
      }
      await this.excerptRepository.remove(excerpts);

      // collection
      await this.collectionRepository.remove(collection.subset);
      await this.collectionRepository.remove(collection);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async removeAll(user: User) {
    const collections = await this.collectionRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i];
      await this.remove(collection.id, user);
    }
  }

  async cleanEmptySubsets(id: number, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const collection = await this.collectionRepository.findOneOrFail({
        where: {
          id,
          user: {
            id: user.id,
          },
        },
        relations: {
          subset: true,
        },
      });

      const removed: Collection[] = [];
      const added: Collection[] = [];
      for (let i = 0; i < collection.subset.length; i++) {
        const item = collection.subset[i];
        const excerpts = await this.excerptRepository.find({
          where: {
            user: {
              id: user.id,
            },
            collection: {
              id: item.id,
            },
          },
        });

        if (excerpts.length === 0) {
          removed.push(item);
        } else {
          added.push(item);
        }
      }

      if (removed.length > 0) {
        collection.subset = added;
        await this.collectionRepository.save(collection);

        for (let i = 0; i < removed.length; i++) {
          await this.collectionRepository.remove(removed[i]);
        }
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async addExcerptCount(collections: Collection[] | SelectCollectionDto[]) {
    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i];
      for (let j = 0; j < collection.subset.length; j++) {
        const item = collection.subset[j];
        item.excerptCount = (
          await this.excerptRepository.find({
            where: {
              collection: {
                id: item.id,
              },
            },
          })
        ).length;
      }
    }
  }
}
