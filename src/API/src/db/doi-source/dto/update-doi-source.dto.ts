import { PartialType } from '@nestjs/mapped-types';
import { CreateDoiSourceDto } from './create-doi-source.dto';

export class UpdateDoiSourceDto extends PartialType(CreateDoiSourceDto) {}
