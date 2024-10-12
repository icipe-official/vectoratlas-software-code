import { Injectable } from '@nestjs/common';
import { DoiSource } from './entities/doi-source.entity';

@Injectable()
export class DoiSourceService {
  create(createDoiSourceDto: DoiSource) {
    return 'This action adds a new doiSource';
  }

  findAll() {
    return 'This action returns all doiSource';
  }

  findOne(id: number) {
    return `This action returns a #${id} doiSource`;
  }

  update(id: number, updateDoiSourceDto: DoiSource) {
    return `This action updates a #${id} doiSource`;
  }

  remove(id: number) {
    return `This action removes a #${id} doiSource`;
  }
}
