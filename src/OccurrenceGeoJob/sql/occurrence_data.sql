select
    public.occurrence.id as occurrence_id,
    public.species.name as recorded_species_species,
    public.species.display_name as species_display_name,
    public.species.category as species_category,
    public.species.color as species_color,
    public.occurrence.binary_presence as occurrence_binary_presence,
    public.occurrence.abundance_data as occurrence_abundance_data,
    public.occurrence.bio_data as occurrence_bio_data,
    public.occurrence.insecticide_resistance_data as occurrence_insecticide_resistance_data,
    public.occurrence.season_given as occurrence_season_given,
    public.occurrence.season_calc as occurrence_season_calc,
    public.occurrence.year_start as occurrence_year_start,
    public.occurrence.larval_data as occurrence_larval_data,
    public.occurrence.adult_data as occurrence_adult_data,
    public.site.country as site_country,
    public.country.name as country_name,
    public.country.iso_code_2 as country_iso2,
    public.country.iso_code_3 as country_iso3,
    CASE 
      WHEN public.site.location IS NULL THEN NULL
      ELSE '{"type":"Point","coordinates":[' || ST_Y(public.site.location) || ',' || ST_X(public.site.location) || ']}'
    END as site_location_geojson,
    public.sample.control as sample_control
from public.occurrence
inner join public.dataset on public.occurrence."datasetId" = public.dataset.id and public.dataset.status = 'Approved'
left join public.site on public.occurrence."siteId" = public.site.id
left join public.recorded_species on public.occurrence."recordedSpeciesId" = public.recorded_species.id
left join public.species on public.recorded_species.species = public.species.id
left join public.country on public.site.country_id = public.country.id
left join public.sample on public.occurrence."sampleId" = public.sample.id
order by public.occurrence.id
