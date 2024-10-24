import { PartialType } from '@nestjs/mapped-types';
import { CreateDoiDto } from './create-doi.dto';

export class UpdateDoiDto extends PartialType(CreateDoiDto) {}
