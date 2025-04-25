import { Args, Query, Resolver } from '@nestjs/graphql';
import { UploadedModel } from './entities/uploaded-model.entity';
import { UploadedModelService } from './uploaded-model.service';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { StreamableFile, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/user.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { UserRole } from 'src/auth/user_role/user_role.entity';

export const voidTypeResolver = () => null;
export const uploadedModelClassTypeResolver = () => UploadedModel;
export const uploadedModelListTypeResolver = () => [UploadedModel];

@Resolver(uploadedModelClassTypeResolver)
export class UploadedModelResolver {
  constructor(private uploadedModelService: UploadedModelService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ModelManager, Role.Admin)
  @Query(uploadedModelClassTypeResolver, { nullable: true })
  async uploadedModelById(
    // @AuthUser() user: any,
    @Args('id', { type: () => String }) id: string,
  ) {
    return await this.uploadedModelService.getUploadedModel(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ModelManager, Role.Admin)
  @Query(uploadedModelListTypeResolver, { nullable: true })
  async allUploadedModels() {
    return await this.uploadedModelService.getUploadedModels();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ModelManager, Role.Admin)
  @Query(uploadedModelListTypeResolver, { nullable: true })
  async uploadedModelsByUploader(
    @Args('uploader', { type: () => String }) uploader: string,
  ) {
    return await this.uploadedModelService.getUploadedModelsByUploader(
      uploader,
    );
  }
}
