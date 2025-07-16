import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from "@nestjs/class-validator";


class SampleDto {
  @IsOptional()
  @IsString()
  sampling_occurrence_1?: string;

  @IsOptional()
  @IsNumber()
  occurrence_n_tot?: number;
}

class ReferenceDto {
  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  citation?: string;

  @IsOptional()
  @IsNumber()
  year?: number;
}

class RecordedSpeciesDto {
  @IsOptional()
  @IsString()
  species?: string;
}

export class UpdateOccurrenceDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsNumber()
  year_start?: number;

  @IsOptional()
  @IsNumber()
  month_start?: number;

  @IsOptional()
  @IsString()
  binary_presence?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SampleDto)
  sample?: SampleDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReferenceDto)
  reference?: ReferenceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecordedSpeciesDto)
  recorded_species?: RecordedSpeciesDto;
}
