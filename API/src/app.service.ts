import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class AppService {
  async getData(): Promise<string> {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'mva',
      password: 'linuxvm',
      port: 5432,
    });
    await client.connect();
    const data = await client.query('SELECT * FROM geo_data');
    await client.end();
    return data.rows;
  }
}
