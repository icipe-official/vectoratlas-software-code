import { Args, Query, Resolver, Field, ObjectType } from '@nestjs/graphql';
import { ModelsTransformationService } from './modelsTransformation.service';
import { stringTypeResolver, numberTypeResolver } from '../commonTypes';

@ObjectType()
export class ModelProcessingStatus {
  @Field(stringTypeResolver)
  status: string;
}

export const modelProcessingStatusClassTypeResolver = () =>
  ModelProcessingStatus;

@Resolver()
export class ModelsResolver {
  constructor(
    private modelsTransformationService: ModelsTransformationService,
  ) {}

  @Query(modelProcessingStatusClassTypeResolver)
  async postProcessModel(
    @Args('modelName', { type: stringTypeResolver }) modelName: string,
    @Args('displayName', { type: stringTypeResolver }) displayName: string,
    @Args('maxValue', { type: numberTypeResolver }) maxValue: number,
    @Args('blobLocation', { type: stringTypeResolver }) blobLocation: string,
  ) {
    return await this.modelsTransformationService.postProcessModelOutput(
      modelName,
      displayName,
      maxValue,
      blobLocation,
    );
  }
}
