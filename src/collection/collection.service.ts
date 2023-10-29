import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Paginate } from '../common/tool/pagination';
import { User } from '../user/entities/user.entity';
import { SearchCollectionDto } from './dto/search-collection.dto';

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
      .andWhere('collection.user.id = :userId', { userId: user.id })
      .addOrderBy('collection.id', 'DESC')
      .getMany();
  }

  async findAll(user: User, query: PaginationQueryDto) {
    const qb = this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.subset', 'subset')
      .where('collection.parentSubset is null')
      .where('collection.user = :userId', { userId: user.id })
      .addOrderBy('collection.sort', 'DESC')
      .addOrderBy('collection.id', 'DESC');
    return Paginate<Collection>(qb, query);
  }

  async findOne(id: number, user: User) {
    return this.collectionRepository.findOne({
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
  }

  async update(
    id: number,
    user: User,
    updateCollectionDto: UpdateCollectionDto,
  ) {
    const { name, sort, subset } = updateCollectionDto;
    const collection = await this.collectionRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });

    const newName = name?.trim();
    if (newName) {
      collection.name = newName;
    }

    if (sort) {
      collection.sort = sort;
    }

    if (subset && subset.length > 0) {
      collection.subset = [
        ...(collection.subset ?? []),
        ...subset.map((item) => new Collection({ ...item })),
      ];
    }

    await this.collectionRepository.save(collection);
  }

  async remove(id: number, user: User) {
    const collection = await this.collectionRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });
    await this.collectionRepository.remove(collection);
  }

  async removeAll(user: User) {
    const collections = await this.collectionRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    await this.collectionRepository.remove(collections);
  }
}
