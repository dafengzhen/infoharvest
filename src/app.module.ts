import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CollectionModule } from './collection/collection.module';
import { ExcerptModule } from './excerpt/excerpt.module';
import { HistoryModule } from './history/history.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import databaseConfigProd from './config/database.config.prod';
import { Excerpt } from './excerpt/entities/excerpt.entity';
import { Collection } from './collection/entities/collection.entity';
import { User } from './user/entities/user.entity';
import { CollectionService } from './collection/collection.service';
import { ExcerptService } from './excerpt/excerpt.service';
import { History } from './history/entities/history.entity';
import { ExcerptName } from './excerpt/entities/excerpt-name.entity';
import { ExcerptLink } from './excerpt/entities/excerpt-link.entity';
import { ExcerptState } from './excerpt/entities/excerpt-state.entity';

/**
 * AppModule.
 *
 * @author dafengzhen
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production'
          ? databaseConfig
          : databaseConfigProd,
    }),
    TypeOrmModule.forFeature([
      User,
      Collection,
      Excerpt,
      ExcerptName,
      ExcerptLink,
      ExcerptState,
      History,
    ]),
    AuthModule,
    UserModule,
    CollectionModule,
    ExcerptModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    CollectionService,
    ExcerptService,
  ],
})
export class AppModule {}
