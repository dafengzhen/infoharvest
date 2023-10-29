import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { TokenVo } from './vo/token.vo';
import { Collection } from '../collection/entities/collection.entity';
import { Excerpt } from '../excerpt/entities/excerpt.entity';
import { History } from '../history/entities/history.entity';
import { ExcerptLink } from '../excerpt/entities/excerpt-link.entity';
import { ExcerptName } from '../excerpt/entities/excerpt-name.entity';
import { ExcerptState } from '../excerpt/entities/excerpt-state.entity';

/**
 * UserService,
 *
 * @author dafengzhen
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

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

    private readonly authService: AuthService,

    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const username = createUserDto.username;
    const password = createUserDto.password;

    if (
      await this.userRepository.exist({
        where: { username },
      })
    ) {
      // 用户已经存在，创建失败
      throw new BadRequestException('The user already exists, creation failed');
    }

    const user = await this.userRepository.save(
      new User({
        username,
        password: await this.authService.encryptPassword(password),
      }),
    );

    return new TokenVo({
      id: user.id,
      username: user.username,
      token: await this.authService.getTokenForUser(user),
    });
  }

  async getUsersCountByDate() {
    return this.userRepository
      .createQueryBuilder()
      .select('DATE(create_date)', 'date')
      .addSelect('COUNT(id)', 'count')
      .groupBy('DATE(create_date)')
      .getRawMany();
  }

  async findOne(id: number, user: User) {
    this.checkIfUserIsOwner(id, user);
    return this.userRepository.findOneBy({
      id,
    });
  }

  async update(id: number, currentUser: User, updateUserDto: UpdateUserDto) {
    this.checkIfUserIsOwner(id, currentUser);
    const user = await this.userRepository.findOneBy({
      id,
    });

    const username = updateUserDto.username;
    if (username) {
      if (
        await this.userRepository.exist({
          where: { username },
        })
      ) {
        // 用户名称已经存在，请考虑重新命名
        throw new BadRequestException(
          'Username already exists, please consider choosing a different name',
        );
      }

      user.username = username;
    }

    const oldPassword = updateUserDto.oldPassword;
    const newPassword = updateUserDto.newPassword;
    if (oldPassword && !newPassword) {
      // 新密码不能为空
      throw new BadRequestException('The new password cannot be empty');
    } else if (newPassword && !oldPassword) {
      // 要更新新密码，必须输入旧密码
      throw new BadRequestException(
        'To update the new password, you must enter the old password',
      );
    } else if (newPassword && oldPassword) {
      if (
        !(await this.authService.isMatchPassword(oldPassword, user.password))
      ) {
        // 抱歉，旧密码验证错误
        throw new BadRequestException(
          'Sorry, the old password verification failed',
        );
      }

      user.password = await this.authService.encryptPassword(newPassword);
    }

    await this.userRepository.save(user);
  }

  async remove(currentUser: User) {
    const id = currentUser.id;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: {
          collections: {
            subset: true,
          },
          excerpts: {
            names: true,
            links: true,
            states: true,
          },
          histories: true,
        },
      });

      // histories
      await this.historyRepository.remove(user.histories);

      // excerpts
      const excerpts = user.excerpts;
      for (let i = 0; i < excerpts.length; i++) {
        const excerpt = excerpts[i];
        await this.excerptNameRepository.remove(excerpt.names);
        await this.excerptLinkRepository.remove(excerpt.links);
        await this.excerptStateRepository.remove(excerpt.states);
      }
      await this.excerptRepository.remove(excerpts);

      // collections
      const collections = user.collections;
      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        await this.collectionRepository.remove(collection.subset);
      }
      await this.collectionRepository.remove(collections);

      // user
      await this.userRepository.remove(user);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  checkIfUserIsOwner(id: number, user: User) {
    if (id !== user.id) {
      // 抱歉，非用户本人，无权限操作该用户资源
      throw new ForbiddenException(
        "Apologies, not the user themselves, lacking permission to access the user's resources",
      );
    }
  }
}
