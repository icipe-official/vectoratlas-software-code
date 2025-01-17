import {
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { Field, ImportWizardState } from '../../../types';

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

interface Props {
  rawColumn: string;
  target?: Field<any>;
  isHeader?: boolean;
  state: ImportWizardState;
}

const TargetItem = ({ state, rawColumn, target, isHeader }: Props) => {
  const [targetField, setTargetField] = useState('');
  const targetFields = state.targetFields;
  const columnMap = state.columnMap;

  const handleChange = (event: SelectChangeEvent) => {
    setTargetField(event.target.value);
    const colMap = columnMap.filter((el) => el.source != rawColumn);
    colMap.push({ source: rawColumn, target: event.target.value });
    state.columnMap = colMap;
  };

  useEffect(() => {}, []);

  return (
    <FormControl variant="outlined" sx={{ m: 1, minWidth: 300 }}>
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={targetField}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em></em>
        </MenuItem>
        {targetFields.map((el) => (
          <MenuItem key={el.key} value={el.key}>
            {el.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const MatchColumnItem = ({
  state,
  rawColumn,
  target,
  isHeader,
}: Props) => {
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
            target={target}
            isHeader={false}
          />
        </ListItem>
      )}
    </List>
  );
};
