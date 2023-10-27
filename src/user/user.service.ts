import { BadRequestException, Injectable } from '@nestjs/common';
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
    private readonly authService: AuthService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async findOne(id: number) {
    return this.userRepository
      .findOneBy({
        id,
      })
      .then(
        (value) =>
          new User({
            id: value.id,
            username: value.username,
            createDate: value.createDate,
            updateDate: value.updateDate,
          }),
      );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    await this.userRepository.remove(user);
  }
}
