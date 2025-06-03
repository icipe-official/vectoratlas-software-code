import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, TextField, FormHelperText } from '@mui/material';
import { countryList } from '../../state/map/utils/countrySpeciesLists';

interface CountryProps {
  label?: string;
  value?: string;
  onChange?: (evt: any, val: any) => void;
  sx?: object;
  helperText?: string;
}

export const CountryList = (props: CountryProps) => {
  const countries = [...countryList, ''];
  const [value, setValue] = useState<string | null>(props.value || null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setValue(props.value || '');
  }, [props.value]);

  useEffect(() => {
    props.onChange?.(null, value);
  }, [props, value]);

  useEffect(() => {
    if (!value) {
      setError(true); // Set error if country list is empty
    } else {
      setError(false); // Reset error when country list is not empty
    }
  }, [value]);

  return (
    <Box>
      <Autocomplete
        sx={props.sx}
        options={countries}
        autoHighlight
        value={value}
        onChange={(evt, val) => setValue(val || null)}
        renderOption={(props, option) => {
          const { ...optionProps } = props;
          return (
            <Box
              component="li"
              sx={{
                '& .MuiInputBase-root': {
                  borderColor: error ? 'red' : '',
                },
                '& .MuiInputLabel-root': {
                  color: error ? 'red' : '',
                },
                '& > img': { mr: 2, flexShrink: 0 },
              }}
              {...optionProps}
            >
              {/* Render option here */}
              {option}
            </Box>
          );
        }}
        renderInput={(params) => (
          <>
            <TextField {...params} label={props.label} error={error} />
            {error && (
              <FormHelperText error>
                {props.helperText || 'No countries available'}
              </FormHelperText>
            )}
          </>
        )}
      />
    </Box>
  );
};
