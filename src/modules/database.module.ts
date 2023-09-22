import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HashedUrl } from 'src/entities/hashed_url.entities';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const mysqlDefaultConfig: TypeOrmModuleOptions = {
  // logging: process.env.NODE_ENV === 'dev',
  type: (process.env.DATABASE_TYPE || 'mysql') as MysqlConnectionOptions['type'],
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'test',
  entities: [HashedUrl],
  autoLoadEntities: true,
  // synchronize: true,
  // migrationsRun: false,
  // migrations: [],
};

@Module({
  imports: [TypeOrmModule.forRoot(mysqlDefaultConfig)],
})
export class DatabaseModule {}
