import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { Country } from './entities/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
