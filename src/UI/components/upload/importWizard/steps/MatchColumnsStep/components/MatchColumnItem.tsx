import {
  Autocomplete,
  Box,
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { Field, Fields, ImportWizardState } from '../../../types';
import Grid2 from '@mui/material/Unstable_Grid2';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { lighten, darken, useTheme, createTheme } from '@mui/system';
import { useSpreadsheetImporter } from '../../../hooks/useSpreadsheetImporter';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  //   ...theme.applyStyles('dark', {
  //     backgroundColor: '#1A2027',
  //   }),
}));
createTheme();
const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),
  // ...theme.applyStyles('dark', {
  //   backgroundColor: darken(theme.palette.primary.main, 0.8),
  // }),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

interface TargetProps {
  rawColumn: string;
  targetField?: Field<any>;
  isHeader?: boolean;
  state: ImportWizardState;
  targetValue?: string;
  orderedTargetFields: Field<any>[];
}

interface MatchItemProps extends TargetProps {
  index: Number;
}

const TargetItem = ({
  state,
  rawColumn,
  targetField,
  isHeader,
  targetValue,
  orderedTargetFields,
}: TargetProps) => {
  const [selectedTargetField, setSelectedTargetField] = useState<
    string | undefined
  >(targetValue);

  const orderedFields = [...orderedTargetFields];
  const theme = useTheme();
  const { targetFields } = useSpreadsheetImporter();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTargetField(event.target.value);
    const colMap = state.columnMap.filter((el) => el.source != rawColumn);
    colMap.push({ source: rawColumn, target: event.target.value });
    state.columnMap = colMap;
  };

  const handleChangeAutoComplete = (
    selectedOption: Field<any> | null /* event: React.SyntheticEvent*/
  ) => {
    setValue(selectedOption);
    // When a valid value is selected
    const colMap = state.columnMap.filter((el) => el.source != rawColumn);
    colMap.push({
      source: rawColumn,
      target: selectedOption != null ? selectedOption.key : undefined,
    });
    state.columnMap = colMap;
  };

  useEffect(() => {
    const fields = targetFields.filter((el) => el.key == targetValue);
    setValue(fields.length > 0 ? fields[0] : null);
  }, [targetFields, targetValue]);

  // useEffect(() => {
  //   setSelectedTargetField(targetValue);
  // }, [targetValue]);

  // Value is null by default
  const [value, setValue] = useState<Field<any> | null>(null);
  // Input value is an empty string by default
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <FormControl
      variant="outlined"
      sx={{ m: 1 }}
      style={{ width: '90%', padding: 1 }}
    >
      <Autocomplete
        id={rawColumn}
        options={orderedFields.sort(
          (a, b) => -(b.category || '')?.localeCompare(a.category || '')
        )}
        value={value}
        groupBy={(option) => option.category || ''}
        onChange={(event: any, newValue: Field<any> | null) => {
          handleChangeAutoComplete(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        isOptionEqualToValue={(option, selectedValue) => {
          return option.key === selectedValue.key;
        }}
        renderInput={(params) => (
          <TextField {...params} label="Set Target Field" />
        )}
        renderGroup={(params) => (
          <li key={params.key}>
            <Box
              style={{
                backgroundColor: lighten(theme.palette.primary.main, 0.35),
                padding: '4px 10px',
                position: 'sticky',
                top: '-8px',
                color: 'white', // theme.palette.primary.main,
              }}
            >
              {params.group}
            </Box>
            <GroupItems>{params.children}</GroupItems>
          </li>
        )}
        // renderOption={(
        //   props: React.HTMLAttributes<HTMLLIElement>,
        //   option: Field<any>
        // ) => {
        //   return (
        //     <Typography variant="body1">
        //       {option.label} : {option.description}
        //     </Typography>
        //   );
        // }}
      />
    </FormControl>
  );

  return (
    <FormControl
      variant="outlined"
      sx={{ m: 1 }}
      style={{ width: '90%', padding: 1 }}
    >
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={selectedTargetField}
        onChange={handleChange}
        style={{ width: '90%', padding: 1 }}
      >
        <MenuItem value="">
          <em></em>
        </MenuItem>
        {orderedFields.map((el) => (
          <MenuItem key={el.key} value={el.key}>
            <Box style={{}}>{el.label}</Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const MatchColumnItem = ({
  state,
  rawColumn,
  targetField,
  isHeader,
  targetValue,
  orderedTargetFields,
  index,
}: MatchItemProps) => {
  return (
    <List
      sx={{
        width: '100%',
        // maxWidth: 500,
        bgcolor: 'background.paper',
        padding: 0,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#d5d5d5',
      }}
    >
      {isHeader ? (
        <ListItem>
          <ListItemIcon style={{ display: 'block', visibility: 'hidden' }}>
            <ViewColumnIcon />
          </ListItemIcon>
          <ListItemText
            style={{ /*minWidth: 300,*/ width: '50%', fontWeight: 'bold' }}
            id="switch-list-label-bluetooth"
            primary={
              <Typography style={{ fontWeight: 'bold' }} variant="body1">
                Source Column
              </Typography>
            }
          />
          <ListItemText
            style={{ /*minWidth: 300,*/ width: '50%' }}
            id="switch-list-label-bluetooth"
            primary={
              <Typography style={{ fontWeight: 'bold' }} variant="body1">
                Target Column
              </Typography>
            }
          />
        </ListItem>
      ) : (
        <ListItem>
          <ListItemIcon>
            <Typography variant="body1" style={{ marginRight: 10 }}>
              {index.toString()}.
            </Typography>
            <ViewColumnIcon />
          </ListItemIcon>
          <ListItemText
            style={{ /*minWidth: 300,*/ width: '50%' }}
            id="switch-list-label-bluetooth"
            primary={rawColumn}
          />
          <TargetItem
            state={state}
            rawColumn={rawColumn}
            targetField={targetField}
            isHeader={false}
            targetValue={targetValue || ''}
            orderedTargetFields={orderedTargetFields}
          />
        </ListItem>
      )}
    </List>
  );
};
