import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { TokenVo } from './vo/token.vo';

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

    private readonly authService: AuthService,
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

  async remove(id: number, user: User) {
    this.checkIfUserIsOwner(id, user);
    await this.userRepository.remove(
      await this.userRepository.findOne({
        where: { id },
      }),
    );
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
