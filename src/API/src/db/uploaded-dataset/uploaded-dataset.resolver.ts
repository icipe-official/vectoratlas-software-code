import { Args, Query, Resolver } from '@nestjs/graphql';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import { UploadedDatasetService } from './uploaded-dataset.service';

export const uploadedDatasetClassTypeResolver = () => UploadedDataset;

@Resolver(uploadedDatasetClassTypeResolver)
export class UploadedDatasetResolver {
  constructor(private uploadedDatasetService: UploadedDatasetService) {}

  @Query(uploadedDatasetClassTypeResolver, { nullable: true })
  async uploadedDatasetById(@Args('id', { type: () => String }) id: string) {
    return await this.uploadedDatasetService.getUploadedDataset(id);
  }
}
