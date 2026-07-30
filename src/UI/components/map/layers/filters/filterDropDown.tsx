import React, { useMemo, useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { filterHandler } from '../../../../state/map/mapSlice';

const safeArray = (arr: any) => (Array.isArray(arr) ? arr : []);
const safeLower = (val: any) => String(val || '').toLowerCase();

const fetchSpeciesCatalogue = async (token: string | null): Promise<any[]> => {
  try {
    const response = await fetch('/vector-api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query:
          'query GetAllRecordedSpecies { allRecordedSpecies { id, species, display_name, category } }',
      }),
    });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data?.allRecordedSpecies || [];
  } catch (err) {
    return [];
  }
};

const fetchCountriesCatalogue = async (
  token: string | null
): Promise<any[]> => {
  try {
    const response = await fetch('/vector-api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query: 'query GetAllCountries { allCountries { id, name } }',
      }),
    });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data?.allCountries || [];
  } catch (err) {
    return [];
  }
};

export const FilterDropDown = (props: any) => {
  const dispatch = useAppDispatch();
  const [dbOptions, setDbOptions] = useState<any[]>([]);
  const [countryDbOptions, setCountryDbOptions] = useState<any[]>([]);
  const { prefix, filterName, filterTitle, category } = props;

  const isSpeciesFilter = ['species', 'primary', 'secondary'].includes(
    safeLower(filterName)
  );
  const isCountryFilter = safeLower(filterName) === 'country';

  const filters = useAppSelector((state) => state.map.filters) || {};
  const filterAvailableValues = useAppSelector(
    (state) => state.map.filterValues
  ) as Record<string, string[]>;
  const token = useAppSelector((state) => state.auth.token);

  const allValues = safeArray(filterAvailableValues[filterName]);
  const rawSelectedValues = safeArray(filters[filterName]?.value);

  useEffect(() => {
    if (isSpeciesFilter) {
      fetchSpeciesCatalogue(token as string | null).then(setDbOptions);
    }
    if (isCountryFilter) {
      fetchCountriesCatalogue(token as string | null).then(setCountryDbOptions);
    }
  }, [isSpeciesFilter, isCountryFilter, token]);

  const finalOptionsArray = useMemo(() => {
    if (isSpeciesFilter) {
      if (dbOptions.length === 0) return [];
      const cat = safeLower(category);
      const filtered = cat
        ? dbOptions.filter((i) => safeLower(i.category) === cat)
        : dbOptions;
      return filtered.map((i) => i.species);
    }
    if (isCountryFilter) {
      if (countryDbOptions.length === 0) return allValues;
      return countryDbOptions.map((c) => c.name).sort();
    }
    return allValues;
  }, [
    allValues,
    dbOptions,
    countryDbOptions,
    isSpeciesFilter,
    isCountryFilter,
    category,
  ]);

  const formatLabel = (option: string) => {
    if (isSpeciesFilter) {
      const entry = dbOptions.find(
        (i) => safeLower(i.species) === safeLower(option)
      );
      return entry ? entry.display_name || entry.species : option;
    }
    return option;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '5px',
        marginBottom: '10px',
      }}
    >
      <Typography
        variant="inherit"
        color="primary"
        fontSize={12}
        sx={{ paddingBottom: 1 }}
      >
        {filterTitle}
      </Typography>
      <Autocomplete
        multiple
        size="small"
        onChange={(_, val) =>
          dispatch(filterHandler({ filterName, filterOptions: val }))
        }
        options={finalOptionsArray}
        value={rawSelectedValues.filter((v) => finalOptionsArray.includes(v))}
        disableCloseOnSelect
        getOptionLabel={formatLabel}
        isOptionEqualToValue={(o, v) => safeLower(o) === safeLower(v)}
        renderOption={(props, option, { selected }) => {
          const label = formatLabel(option);

          const shouldBeItalic = isSpeciesFilter;

          return (
            <li {...props} key={option}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              <span style={{ fontStyle: shouldBeItalic ? 'italic' : 'normal' }}>
                {label}
              </span>
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </div>
  );
};

export default FilterDropDown;
