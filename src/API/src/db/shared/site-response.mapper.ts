import { Site } from './entities/site.entity';

export interface SiteReturn {
  id: string;
  site: string;
  country: string;
  location: any;
  admin_level_1: string;
  admin_level_2: string;
  area_type: string;
}

export function mapSitesToReturnItems(items: Site[]): SiteReturn[] {
  return items.map((x) => ({
    id: x.id,
    site: x.site,
    country: x.country,
    location: x.location,
    admin_level_1: x.admin_level_1,
    admin_level_2: x.admin_level_2,
    area_type: x.area_type,
  }));
}
