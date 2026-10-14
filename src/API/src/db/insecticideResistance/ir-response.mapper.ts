import { InsecticideResistanceBioassays } from './entities/insecticideResistanceBioassays.entity';

/**
 * v1: top-level bioassay scalars only. The ~30 related sub-tables are
 * intentionally NOT flattened here.
 */
export interface IrReturn {
  id: string;
  insecticide_tested: string;
  insecticide_class: string;
  irac_moa: string;
  irac_moa_code: string;
  concentration_percent: string;
  mosquitoes_tested_n: string;
  mosquitoes_dead_n: string;
  percent_mortality: string;
  knock_down_percent: string;
  bioassay_notes: string;
}

export function mapIrToReturnItems(
  items: InsecticideResistanceBioassays[],
): IrReturn[] {
  return items.map((x) => ({
    id: x.id,
    insecticide_tested: x.insecticide_tested,
    insecticide_class: x.insecticide_class,
    irac_moa: x.irac_moa,
    irac_moa_code: x.irac_moa_code,
    concentration_percent: x.concentration_percent,
    mosquitoes_tested_n: x.mosquitoes_tested_n,
    mosquitoes_dead_n: x.mosquitoes_dead_n,
    percent_mortality: x.percent_mortality,
    knock_down_percent: x.knock_down_percent,
    bioassay_notes: x.bioassay_notes,
  }));
}
