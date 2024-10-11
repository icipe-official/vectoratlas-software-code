import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { countryList } from '../../state/map/utils/countrySpeciesLists';

interface CountryProps {
    label?: string;
  value?: string;
  onChange?: (evt, val) => void;
  sx?: object;
}

export const CountryList = (props: CountryProps) => {
  const countries = countryList;
  const [value, setValue] = useState<string>(props.value || '');
  useEffect(() => {
    setValue(props.value || '');
  }, [props.value]);

  useEffect(() => {
    props.onChange?.(null, value);
  }, [props, value]);

  return (
    <Autocomplete
      sx={props.sx}
      options={countries}
      autoHighlight
      value={value}
      onChange={(evt, val) => setValue(val || '')}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            key={key}
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            {/* <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt=""
            /> */}
            {/* {option.label} ({option.code}) */}
            {option}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          slotProps={{
            htmlInput: {
              ...params.InputProps,
              autocomplete: 'new-password', //disable autocomplete and autofill
            },
          }}
        />
      )}
    />
  );
};
