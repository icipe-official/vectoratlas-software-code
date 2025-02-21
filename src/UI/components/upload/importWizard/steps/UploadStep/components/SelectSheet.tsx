import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { ImportWizardState } from '../../../types';

interface Props {
  state: ImportWizardState;
  onSelectWorksheet: (v: ImportWizardState) => Promise<void>;
}

function SelectSheet({ state, onSelectWorksheet }: Props) {
  const workbook = state.workbook;
  const [checkedWorksheet, setCheckedWorksheet] = useState(
    state.selectedWorksheetName
  );

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
          // for (const col of rowObject[0] as string[]) {
          //   if (col) {
          //     state.rawColumns.push(col);
          //   }
          // }
          state.rawColumns = rowObject[0] as string[];
          state.rawRecords = rowObject;
        }
      }
    },
    [state, workbook?.Sheets]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sheetName = event.target.value;
    setCheckedWorksheet(sheetName);
    onSelectWorksheet(state);
    setColumns(sheetName);
  };

  useEffect(() => {
    const sheetName = workbook?.SheetNames?.[0];
    setColumns(sheetName);
  }, [setColumns, workbook?.SheetNames]);

  useEffect(() => {
    setCheckedWorksheet(state.selectedWorksheetName);
  }, [state.selectedWorksheetName]);

  if (!workbook) {
    return <Box></Box>;
  }

  return (
    <FormControl>
      <FormLabel>Select Worksheet</FormLabel>
      <RadioGroup
        // defaultValue={workbook.SheetNames[0]}
        name="worksheets"
        onChange={handleChange}
      >
        {workbook.SheetNames.map((el: string, idx: number) => (
          <FormControlLabel
            key={el}
            value={el}
            control={<Radio checked={el === checkedWorksheet} />}
            label={el}
          ></FormControlLabel>
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default SelectSheet;
