import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailtstestDto } from './create-emailtstest.dto';

export class UpdateEmailtstestDto extends PartialType(CreateEmailtstestDto) {}
