import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Collection } from '../collection/entities/collection.entity';
import { Excerpt } from '../excerpt/entities/excerpt.entity';
import { History } from '../history/entities/history.entity';
import { ExcerptName } from '../excerpt/entities/excerpt-name.entity';
import { ExcerptLink } from '../excerpt/entities/excerpt-link.entity';
import { ExcerptState } from '../excerpt/entities/excerpt-state.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      User,
      Collection,
      Excerpt,
      ExcerptName,
      ExcerptLink,
      ExcerptState,
      History,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
