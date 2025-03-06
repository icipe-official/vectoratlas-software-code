import { Args, Query, Resolver } from '@nestjs/graphql';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { StreamableFile, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/user.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { UserRole } from 'src/auth/user_role/user_role.entity';

export const voidTypeResolver = () => null;
export const uploadedDatasetClassTypeResolver = () => UploadedDataset;
export const uploadedDatasetListTypeResolver = () => [UploadedDataset];

@Resolver(uploadedDatasetClassTypeResolver)
export class UploadedDatasetResolver {
  constructor(private uploadedDatasetService: UploadedDatasetService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Uploader, Role.Reviewer, Role.ReviewerManager, Role.Admin)
  @Query(uploadedDatasetClassTypeResolver, { nullable: true })
  async uploadedDatasetById(
    // @AuthUser() user: any,
    @Args('id', { type: () => String }) id: string,
  ) {
    return await this.uploadedDatasetService.getUploadedDataset(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Reviewer, Role.ReviewerManager, Role.Admin)
  @Query(uploadedDatasetListTypeResolver, { nullable: true })
  async allUploadedDatasets() {
    return await this.uploadedDatasetService.getUploadedDatasets();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Uploader, Role.Reviewer, Role.ReviewerManager, Role.Admin)
  @Query(uploadedDatasetListTypeResolver, { nullable: true })
  async uploadedDatasetsByUploader(
    @Args('uploader', { type: () => String }) uploader: string,
  ) {
    return await this.uploadedDatasetService.getUploadedDatasetsByUploader(
      uploader,
    );
  }

  // @Query(voidTypeResolver, { nullable: false })
  // async downloadDataset(
  //   @AuthUser() user: UserRole,
  //   // @Args('uploader', { type: () => String }) uploader: string,
  //    @Query('id', { type: () => String }) id: string,
  //    @Query('fileType', { type: () => String }) fileType: string,
  // ) {
  //   if (user?.is_admin || user?.is_reviewer || user?.is_reviewer_manager) {
  //     return await this.uploadedDatasetService.();
  //   }
  //   return await this.uploadedDatasetService.getUploadedDatasetsByUploader(
  //     user.auth0_id,
  //   );
  // }
}
