import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async validate(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await this.isMatchPassword(password, user.password))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async isMatchPassword(currentPassword: string, userPassword: string) {
    return bcrypt.compare(currentPassword, userPassword);
  }

  async getTokenForUser(user: User) {
    return this.jwtService.sign({ sub: user.id, username: user.username });
  }

  async getTokenForUserId(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }
}
