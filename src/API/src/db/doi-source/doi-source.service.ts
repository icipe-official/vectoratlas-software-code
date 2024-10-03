import { Injectable } from '@nestjs/common';
import { CreateDoiSourceDto } from './dto/create-doi-source.dto';
import { UpdateDoiSourceDto } from './dto/update-doi-source.dto';

@Injectable()
export class DoiSourceService {
  create(createDoiSourceDto: CreateDoiSourceDto) {
    return 'This action adds a new doiSource';
  }

  findAll() {
    return `This action returns all doiSource`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doiSource`;
  }

  update(id: number, updateDoiSourceDto: UpdateDoiSourceDto) {
    return `This action updates a #${id} doiSource`;
  }

  remove(id: number) {
    return `This action removes a #${id} doiSource`;
  }
}
