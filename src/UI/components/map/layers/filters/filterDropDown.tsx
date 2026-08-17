import React, { useMemo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { filterHandler } from '../../../../state/map/mapSlice';
import { useSpeciesDb } from '../../../shared/useSpeciesDb';
import { useCountryDb } from '../../../shared/useCountryDb';

const safeArray = (arr: any) => (Array.isArray(arr) ? arr : []);
const safeLower = (val: any) => String(val || '').toLowerCase();

// Standard MUI filter fallback
const defaultFilterOptions = createFilterOptions<string>();

export const FilterDropDown = (props: any) => {
  const dispatch = useAppDispatch();
  const { filterName, filterTitle, category } = props;

  const isSpeciesFilter = ['species', 'primary', 'secondary'].includes(
    safeLower(filterName)
  );
  const isCountryFilter = safeLower(filterName) === 'country';

  // Get token for our new hook
  const token = useAppSelector((state) => state.auth.token);

  // Both dropdowns now use clean, cached hooks
  const dbSpeciesData = useSpeciesDb(isSpeciesFilter);
  const dbCountryData = useCountryDb(true, token as string | null);
  const filters = useAppSelector((state) => state.map.filters) || {};
  const filterAvailableValues = useAppSelector(
    (state) => state.map.filterValues
  ) as Record<string, string[]>;

  const allValues = safeArray(filterAvailableValues[filterName]);
  const rawSelectedValues = safeArray(filters[filterName]?.value);

  const occurrenceData =
    useAppSelector((state) => state.map.occurrence_data) || [];

  const finalOptionsArray = useMemo(() => {
    // 1. Species Logic
    if (isSpeciesFilter && dbSpeciesData.length > 0) {
      const cat = safeLower(category);
      const filtered = cat
        ? dbSpeciesData.filter((i) => safeLower(i.category) === cat)
        : dbSpeciesData;
      return filtered.map((i) => i.species);
    }

    // 2. Country Logic
    if (isCountryFilter && dbCountryData.length > 0) {
      return dbCountryData.map((c) => c.name).sort();
    }

    if (allValues.length > 0) {
      return allValues;
    }

    if (occurrenceData.length > 0 && filterName) {
      const extracted = occurrenceData
        .map((item: any) => item[filterName])
        .filter((val: any) => val !== null && val !== undefined && val !== '');

      return Array.from(new Set(extracted)).sort() as string[];
    }

    return [];
  }, [
    allValues,
    dbSpeciesData,
    dbCountryData,
    isSpeciesFilter,
    isCountryFilter,
    category,
    occurrenceData,
    filterName,
  ]);

  const formatLabel = (option: string) => {
    if (isSpeciesFilter) {
      const entry = dbSpeciesData.find(
        (i) => safeLower(i.species) === safeLower(option)
      );
      return entry ? entry.display_name || entry.species : option;
    }
    return option;
  };

  // Cross-reference Alternative Names in search
  const filterOptions = (options: string[], state: any) => {
    if (isCountryFilter) {
      const inputValue = state.inputValue.toLowerCase();
      return options.filter((option) => {
        // Match primary name
        if (option.toLowerCase().includes(inputValue)) return true;

        // Match alternative names (e.g. "Ivory Coast" -> "Cote d'Ivoire")
        const country = dbCountryData.find(
          (c) => safeLower(c.name) === safeLower(option)
        );
        if (country && Array.isArray(country.alternative_names)) {
          return country.alternative_names.some((alt: string) =>
            alt.toLowerCase().includes(inputValue)
          );
        }
        return false;
      });
    }
    return defaultFilterOptions(options, state);
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
        filterOptions={filterOptions}
        isOptionEqualToValue={(o, v) => safeLower(o) === safeLower(v)}
        renderOption={(props, option, { selected }) => {
          const label = formatLabel(option);
          const isItalic =
            isSpeciesFilter || label.toLowerCase().startsWith('an.');
          return (
            <li {...props} key={option}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              <span style={{ fontStyle: isItalic ? 'italic' : 'normal' }}>
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
