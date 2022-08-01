import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import { DataSource } from "typeorm";

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'linuxvm',
  database: 'mva',
  entities: [
      '**/*.entity.ts',
  ],
  migrations: [
    'src/db/migrations/*.ts'
  ]
}

const OrmConfig: DataSource = new DataSource({
  ...typeOrmModuleOptions,
  type: 'postgres',
});
export default OrmConfig;

