import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: process.env.DATABASE_TYPE as 'mysql' | 'mariadb',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
    logging: false,
    timezone: process.env.DATABASE_TIMEZONE,
  }),
);
