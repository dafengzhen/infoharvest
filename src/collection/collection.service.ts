import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Paginate } from '../common/tool/pagination';

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

  create(createCollectionDto: CreateCollectionDto) {
    const { name } = createCollectionDto;
    return this.collectionRepository.save(
      new Collection({
        name,
      }),
    );
  }

  async findAll(query: PaginationQueryDto) {
    const qb = this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.subset', 'subset')
      .where('collection.parentSubset is null');
    return Paginate<Collection>(qb, query);
  }

  async findOne(id: number) {
    return this.collectionRepository.find({
      where: {
        id,
      },
      relations: {
        subset: true,
      },
    });
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto) {
    const { name, sort, subset } = updateCollectionDto;
    const collection = await this.collectionRepository.findOneBy({ id });

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

  async remove(id: number) {
    const collection = await this.collectionRepository.findOneBy({
      id,
    });
    await this.collectionRepository.remove(collection);
  }

  async removeAll() {
    const collections = await this.collectionRepository.find();
    await this.collectionRepository.remove(collections);
  }
}
