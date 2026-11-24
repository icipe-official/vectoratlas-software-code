import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Dataset } from '../shared/entities/dataset.entity';
import { UploadedDataset } from '../uploaded-dataset/entities/uploaded-dataset.entity';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationController } from './organization.controller';
import { AzureBlobService } from '../azure-blob/azure-blob.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Dataset, UploadedDataset])],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationResolver, AzureBlobService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
