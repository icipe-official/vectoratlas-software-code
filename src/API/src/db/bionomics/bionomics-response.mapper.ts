import { Bionomics } from './entities/bionomics.entity';
export interface BionomicsReturn {
  id: string;
  country: string;
  season_given: string;
  season_calc: string;
  control: string;
  insecticide_control: boolean;
  itn_use: boolean;
  year_start: number;
  year_end: number;
  adult_data: boolean;
  larval_site_data: boolean;
}

export function mapBionomicsToReturnItems(
  items: Bionomics[],
): BionomicsReturn[] {
  return items.map((x) => ({
    id: x.id,
    country: x.site?.country,
    season_given: x.season_given,
    season_calc: x.season_calc,
    control: x.control,
    insecticide_control: x.insecticide_control,
    itn_use: x.itn_use,
    year_start: x.year_start,
    year_end: x.year_end,
    adult_data: x.adult_data,
    larval_site_data: x.larval_site_data,
  }));
}
