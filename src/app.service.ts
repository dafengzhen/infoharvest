import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './collection/entities/collection.entity';
import { Excerpt } from './excerpt/entities/excerpt.entity';
import { ExportDataDto } from './common/dto/export-data.dto';
import { ExportUserDataDto } from './common/dto/export-user-data.dto';
import { ExportCollectionDataDto } from './common/dto/export-collection-data.dto';
import { ExportExcerptDataDto } from './common/dto/export-excerpt-data.dto';
import { ImportDataDto } from './common/dto/import-data.dto';
import { CollectionService } from './collection/collection.service';
import { CreateCollectionDto } from './collection/dto/create-collection.dto';
import { ExcerptService } from './excerpt/excerpt.service';
import { UpdateCollectionDto } from './collection/dto/update-collection.dto';
import { CreateExcerptDto } from './excerpt/dto/create-excerpt.dto';

/**
 * AppService.
 *
 * @author dafengzhen
 */
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Excerpt)
    private readonly excerptRepository: Repository<Excerpt>,

    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,

    private readonly collectionService: CollectionService,

    private readonly excerptService: ExcerptService,
  ) {}

  health() {
    return {
      status: 'UP',
    };
  }

  async export(currentUser: User) {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUser.id,
      },
      relations: {
        collections: {
          subset: true,
        },
        excerpts: {
          names: true,
          links: true,
          states: true,
          collection: true,
        },
      },
    });

    const vo = new ExportDataDto();
    vo._type = 'export';
    vo._export_date = new Date().toISOString();
    vo._export_version = 'infoharvest:v1.0';
    vo.user = this.exportUserData(user);
    vo.collections = this.exportCollectionData(user.collections);
    vo.excerpts = this.exportExcerptData(user.excerpts);
    return vo;
  }

  async import(user: User, importDataDto: ImportDataDto) {
    // 默认忽略 id 的处理，后续将支持对传入的 id 进行处理。The handling of the ID is ignored by default. Support for processing the provided ID will be added in the future.
    const collections = importDataDto.collections ?? [];
    const excerpts = importDataDto.excerpts ?? [];
    await this.importCollectionData(user, collections);
    await this.importExcerptData(user, collections, excerpts);
  }

  private async importCollectionData(
    user: User,
    collections: ExportCollectionDataDto[],
  ) {
    for (let i = collections.length - 1; i >= 0; i--) {
      const collection = collections[i];
      const name = (collection.name ?? '').trim();
      const sort = collection.sort ?? 0;
      const subset = (collection.subset ?? [])
        .filter((item) => (item.name ?? '').trim())
        .map((item) => {
          item.name = (item.name ?? '').trim();
          item.sort = item.sort ?? 0;
          item.subset = item.subset ?? [];
          return item;
        });

      if (!name) {
        // 没有名称的集合无法被创建
        throw new BadRequestException(
          'The collection cannot be created without a name',
        );
      }

      const _collection = await this.collectionService.create(
        user,
        new CreateCollectionDto({ name }),
      );

      const updateDto = new UpdateCollectionDto();
      updateDto.sort = sort;
      updateDto.subset = subset;
      await this.collectionService.update(_collection.id, user, updateDto);
    }
  }

  private async importExcerptData(
    user: User,
    collections: ExportCollectionDataDto[],
    excerpts: ExportExcerptDataDto[],
  ) {
    for (let i = excerpts.length - 1; i >= 0; i--) {
      const excerpt = excerpts[i];
      const collectionId = excerpt.collectionId;
      const findCollection = collections.find(
        (item) => item.id === collectionId,
      );
      const name = (findCollection.name ?? '').trim();
      const dto = new CreateExcerptDto();
      dto.names = excerpt.names ?? [];
      dto.links = excerpt.links ?? [];
      dto.states = excerpt.states ?? [];
      dto.sort = excerpt.sort ?? 0;
      dto.icon = (excerpt.icon ?? '').trim();
      dto.description = (excerpt.description ?? '').trim();
      dto.enableHistoryLogging = excerpt.enableHistoryLogging ?? false;

      if (collectionId && findCollection && name) {
        const _collections = await this.collectionRepository.find({
          where: {
            name,
            user: {
              id: user.id,
            },
          },
        });

        if (_collections.length === 1) {
          dto.collectionId = _collections[0].id;
        }
      }

      await this.excerptService.create(user, dto);
    }
  }

  private exportUserData(user: User) {
    const data = new ExportUserDataDto();
    data.id = user.id;
    data.createDate = user.createDate;
    data.updateDate = user.updateDate;
    data.username = user.username;
    data.avatar = user.avatar;
    return data;
  }

  private exportCollectionData(collections: Collection[]) {
    return collections.map((collection) => {
      const newCollection = new ExportCollectionDataDto();
      newCollection.id = collection.id;
      newCollection.createDate = collection.createDate;
      newCollection.updateDate = collection.updateDate;
      newCollection.name = collection.name;
      newCollection.sort = collection.sort;
      newCollection.subset = collection.subset.map((subset) => {
        const newSubset = new ExportCollectionDataDto();
        newSubset.id = subset.id;
        newSubset.createDate = subset.createDate;
        newSubset.updateDate = subset.updateDate;
        newSubset.name = subset.name;
        newSubset.sort = subset.sort;
        return subset;
      });
      return newCollection;
    });
  }

  private exportExcerptData(excerpts: Excerpt[]) {
    return excerpts.map((excerpt) => {
      const newExcerpt = new ExportExcerptDataDto();
      newExcerpt.id = excerpt.id;
      newExcerpt.createDate = excerpt.createDate;
      newExcerpt.updateDate = excerpt.updateDate;
      newExcerpt.icon = excerpt.icon;
      newExcerpt.description = excerpt.description;
      newExcerpt.enableHistoryLogging = excerpt.enableHistoryLogging;
      newExcerpt.sort = excerpt.sort;
      newExcerpt.names = excerpt.names.map((value) => value.name);
      newExcerpt.links = excerpt.links.map((value) => value.link);
      newExcerpt.states = excerpt.states.map((value) => value.state);
      newExcerpt.collectionId = excerpt.collection?.id;
      return newExcerpt;
    });
  }
}
