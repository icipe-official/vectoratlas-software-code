import { Args, Query, Resolver } from '@nestjs/graphql';
import { DatasetService } from './dataset.service';
import { Dataset } from './entities/dataset.entity';

@Resolver()
export class DatasetResolver {
    constructor(private readonly dataSetService: DatasetService) {}

    @Query(() => [Dataset], {nullable: true})
    public async bionomicsDataSet(@Args('id') id: string): Promise<Dataset[]> {
      return  this.dataSetService.findByBionomicsDatasetById(id);
    }

    @Query(() => [Dataset], {nullable: true})
    public async occurrenceDataSet(@Args('id') id: string): Promise<Dataset[]> {
      return  this.dataSetService.findOccurrenceDatasetById(id);
    }



}
