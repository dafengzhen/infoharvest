import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js'],
  logging: false,
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  multipleStatements: true,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  timezone: process.env.DATABASE_TIMEZONE,
};

export default registerAs('database', (): TypeOrmModuleOptions => config);

export const dataSource = new DataSource(config);
