import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { join } from 'path';

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.PGPORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: ['src/db/migrations/*.ts'],
};

const OrmConfig: DataSource = new DataSource({
  ...typeOrmModuleOptions,
  type: 'postgres',
});
export default OrmConfig;
