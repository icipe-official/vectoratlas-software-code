import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { ImportWizardState } from '../../../types';

interface Props {
  state: ImportWizardState;
}

function SelectSheet({ state }: Props) {
  const workbook = state.workbook;
  const setColumns = useCallback(
    (worksheetName: string | undefined) => {
      state.selectedWorksheetName = worksheetName || '';
      if (!worksheetName) {
        state.rawColumns = [];
        return;
      } else {
        const sheet = workbook?.Sheets[worksheetName];
        if (sheet) {
          let rowObject = XLSX.utils.sheet_to_json(
            workbook?.Sheets[worksheetName],
            {
              header: 1,
              defval: '',
            }
          );
          state.rawColumns = rowObject[0] as string[];
        }
      }
    },
    [state, workbook?.Sheets]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sheetName = event.target.value;
    setColumns(sheetName);
  };

  useEffect(() => {
    const sheetName = workbook?.SheetNames?.[0];
    setColumns(sheetName);
  }, [setColumns, workbook?.SheetNames]);

  if (!workbook) {
    return <Box></Box>;
  }

  return (
    <FormControl>
      <FormLabel>Select Worksheet</FormLabel>
      <RadioGroup
        defaultValue={workbook.SheetNames[0]}
        name="worksheets"
        onChange={handleChange}
      >
        {workbook.SheetNames.map((el: string) => (
          <FormControlLabel
            key={el}
            value={el}
            control={<Radio />}
            label={el}
          ></FormControlLabel>
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default SelectSheet;
