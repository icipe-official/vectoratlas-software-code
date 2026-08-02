import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CountryService } from './country.service';
import { Country } from './entities/country.entity';
import { UpdateCountryInput } from './entities/country.input';

@Resolver(() => Country)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Query(() => [Country], { name: 'allCountries' })
  findAll() {
    return this.countryService.findAll();
  }

  @Query(() => Country, { name: 'country', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.countryService.findOne(id);
  }

  @Mutation(() => Country)
  updateCountry(@Args('input') input: UpdateCountryInput) {
    return this.countryService.update(input.id, input as any);
  }
}
