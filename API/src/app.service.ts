import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getData(): Promise<string> {
    return "Hello world";
  }
}
