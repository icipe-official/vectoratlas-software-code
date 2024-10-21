import { Args, Query, Resolver } from '@nestjs/graphql';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/user.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { UserRole } from 'src/auth/user_role/user_role.entity';

export const uploadedDatasetClassTypeResolver = () => UploadedDataset;
export const uploadedDatasetListTypeResolver = () => [UploadedDataset];

@Resolver(uploadedDatasetClassTypeResolver)
export class UploadedDatasetResolver {
  constructor(private uploadedDatasetService: UploadedDatasetService) {}

  @Query(uploadedDatasetClassTypeResolver, { nullable: true })
  async uploadedDatasetById(@Args('id', { type: () => String }) id: string) {
    return await this.uploadedDatasetService.getUploadedDataset(id);
  }

  @Query(uploadedDatasetListTypeResolver, { nullable: true })
  async allUploadedDatasets() {
    return await this.uploadedDatasetService.getUploadedDatasets();
  }

  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(Role.Editor)
  // @Roles(Role.Reviewer)
  // @Roles(Role.ReviewerManager)
  // @Roles(Role.Uploader)
  @Query(uploadedDatasetListTypeResolver, { nullable: true })
  async uploadedDatasetsByUploader(
    @AuthUser() user: UserRole,
    // @Args('uploader', { type: () => String }) uploader: string,
  ) {
    if (user?.is_admin || user?.is_reviewer || user?.is_reviewer_manager) {
      return await this.uploadedDatasetService.getUploadedDatasets();
    }
    return await this.uploadedDatasetService.getUploadedDatasetsByUploader(
      user.auth0_id,
    );
  }
}
