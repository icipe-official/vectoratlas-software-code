export interface SearchIrQueryDto {
  id?: string;
  insecticideTested?: string;
  insecticideClass?: string;
  iracMoa?: string;
  mortalityMin?: string;
  mortalityMax?: string;
  take?: string;
  skip?: string;
  fields?: string;
}
