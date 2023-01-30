import { Args, Query, Resolver } from "@nestjs/graphql";
import { DatasetService } from "./dataset.service";
import { Dataset } from "./entities/dataset.entity";


export const datasetClassTypeResolver = () => Dataset;

@Resolver(datasetClassTypeResolver)
export class DatasetResolver {
  constructor(private datasetService: DatasetService) {}

  @Query(datasetClassTypeResolver, {nullable: true})
  async datasetById(@Args('id', { type: () => String }) id: string) {
    return await this.datasetService.findOneById(id);
  }
}