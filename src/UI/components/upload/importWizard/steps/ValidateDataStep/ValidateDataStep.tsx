import React, { useCallback, useEffect, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import * as XLSX from 'xlsx';
import { SelectColumn } from 'react-data-grid';
import {
  ERROR_COLUMN_NAME,
  ID_COLUMN_NAME,
  ImportStepProps,
  ReactDataGridColDef,
} from '../../types';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from '@mui/material';
import { NavigationPanel } from '../../components/NavigationPanel';
import { validateRow } from '../../utils';
import { toast } from 'react-toastify';

interface Props extends ImportStepProps {}

export interface ConfirmationDialogProps {
  id: string;
  keepMounted: boolean;
  value?: string;
  open: boolean;
  onClose: (value?: boolean) => void;
  message: string;
}

function Confirm(props: ConfirmationDialogProps) {
  const { onClose, value: valueProp, open, message, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const messageRef = React.useRef<HTMLElement>(null);

  const handleCancel = () => {
    onClose(false);
  };

  const handleOk = () => {
    onClose(true);
  };

  const handleEntering = () => {
    if (messageRef.current != null) {
      messageRef.current.focus();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle style={{ color: 'red' }}>Validation Errors!</DialogTitle>
      <DialogContent dividers>
        <Typography
          ref={messageRef}
          variant="body1"
          style={{ textAlign: 'justify' }}
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button color="error" variant="contained" onClick={handleOk}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const ValidateDataStep = ({ state, onContinue, onBack }: Props) => {
  const workbook = state.workbook;
  const sheetName = state.selectedWorksheetName || '';
  const rawColumns = state.rawColumns;

  const [data, setData] = useState<any[]>(state.transformedData);
  const [columns, setColumns] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(
    new Set([])
  );
  const [loading, setLoading] = useState(false);
  const [showWithErrors, setShowWithErrors] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorRowCount, setErrorRowCount] = useState(0);

  const handleErrorCheckboxChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowWithErrors(evt.target.checked);
  };

  const doContinue = useCallback(async () => {
    setLoading(true);
    await onContinue(state);
    setLoading(false);
  }, [onContinue, state]);

  const getRowWithErrors = useCallback(() => {
    const errorRows = state.transformedData.filter(
      (row) => Object.keys(JSON.parse(row[ERROR_COLUMN_NAME])).length > 0
    );
    setErrorRowCount(errorRows.length);
    return errorRows;
  }, [state.transformedData]);

  const handleOnContinue = useCallback(async () => {
    if (state.transformedData.length <= 1) {
      toast.error('The dataset is empty. Please upload a file with valid data');
      return;
    }
    const errorRows = getRowWithErrors();
    // check if there are valid records
    const remaining = state.transformedData.length - errorRows.length - 1; // we subtract 1 coz row 1 is the header
    if (remaining == 0) {
      toast.error('All the records in the dataset are invalid');
      return;
    }

    setErrorRowCount(errorRows.length);
    if (errorRows.length > 0) {
      setDialogOpen(true);
      return;
    }

    await doContinue();
  }, [doContinue, getRowWithErrors, state.transformedData.length]);

  const handleDialogClose = async (confirmed?: boolean) => {
    setDialogOpen(false);
    if (confirmed) {
      await doContinue();
    }
  };

  const filterData = useCallback(
    (withErrors: boolean) => {
      const res = state.transformedData.filter((el, idx) => {
        if (idx === 0) {
          return false; // If its the first row, return false to exclude it as this is the header
        }
        if (!el[ERROR_COLUMN_NAME]) {
          return true;
        }
        return withErrors
          ? Object.keys(JSON.parse(el[ERROR_COLUMN_NAME])).length > 0
          : true;
      });
      return res;
    },
    [state.transformedData]
  );

  useEffect(() => {
    getRowWithErrors();
  }, [getRowWithErrors, state.transformedData]);

  useEffect(() => {
    const res = filterData(showWithErrors);
    setData(
      res.map((el, idx) => {
        return { ...el, idx: el.idx - 1 }; //reduce idx by 1 since we are skipping the top header row when filtering
      })
    );
  }, [filterData, showWithErrors]);

  useEffect(() => {
    // Get columns
    let cols: ReactDataGridColDef[] = [];
    if (state.transformedData) {
      const row = state.transformedData[0];
      if (row) {
        let idColDef = undefined;

        Object.keys(row).forEach((col) => {
          let colName = 'Errors';
          if (col != ERROR_COLUMN_NAME && col != ID_COLUMN_NAME) {
            // set header as blank since we do not want to preempt that the first row is the header
            const targetField = state.targetFields.filter(
              (el) => el.key === col
            );
            colName = targetField ? targetField[0].label : '';
          } else if (col === ID_COLUMN_NAME) {
            colName = 'ID';
          }
          const colDef: ReactDataGridColDef = {
            key: col,
            name: colName,
            width: 100,
            resizable: true,
            renderCell: (props) => {
              const errorCols = props.row[ERROR_COLUMN_NAME]
                ? Object.keys(JSON.parse(props.row[ERROR_COLUMN_NAME]))
                : [];

              const colVal = props.row[col];
              if (props.column.key === ERROR_COLUMN_NAME) {
                if (errorCols.length > 0) {
                  return <div style={{ color: 'red' }}>{colVal}</div>;
                } else {
                  return <div></div>;
                }
              }
              const hasError = errorCols.includes(props.column.key);
              if (hasError) {
                return (
                  <div
                    style={{
                      borderColor: hasError ? 'red' : undefined,
                      borderWidth: 1,
                      borderStyle: 'solid',
                      color: 'red',
                    }}
                  >
                    {colVal}
                  </div>
                );
              } else {
                return <div>{colVal}</div>;
              }
            },
          };

          if (col === ERROR_COLUMN_NAME) {
            cols = [colDef, ...cols]; //Append Error at the start of the array
          } else if (col === ID_COLUMN_NAME) {
            idColDef = { ...colDef } as ReactDataGridColDef; // preserve it for later insertion at the beginning
          } else {
            cols = [...cols, colDef];
          }
        });
        if (idColDef) {
          cols = [idColDef, ...cols]; //Append Error at the start of the array
        }
      }
      setColumns(cols);
    } else if (rawColumns) {
      rawColumns.forEach((col) => {
        // set header as blank since we do not want to preempt that the first row is the header
        cols.push({ key: col, name: '', width: 100, resizable: true });
      });
      setColumns(cols);
    }
  }, [rawColumns, state.targetFields, state.transformedData]);

  useEffect(() => {
    // run validations
    const validated = state.transformedData.map((row) => {
      return validateRow(row, state.targetFields);
    });
  }, [data, state]);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            sx={{ m: 1 }}
            checked={showWithErrors}
            disabled={loading || errorRowCount == 0}
            // checked={true}
            onChange={handleErrorCheckboxChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        }
        label={`Show ${errorRowCount} records with errors`}
      />
      {loading ? (
        <Box style={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DataTable
            rowKeyGetter={(row) => data.indexOf(row)}
            className="rdg-static"
            columns={[/*SelectColumn,*/ ...columns]}
            rows={data}
            // selectedRows={selectedRows}
            onSelectedRowsChange={(newRows) => {
              // allow selecting only one row
              newRows.forEach((value) => {
                if (!selectedRows?.has(value as number)) {
                  const els = Array.from(selectedRows.values());
                  els.push(value as number);
                  // setSelectedRows(new Set([value as number]));
                  setSelectedRows(new Set(els));
                  return;
                }
              });
            }}
          />
        </>
      )}
      <NavigationPanel
        onNext={handleOnContinue}
        onPrev={onBack}
        isLoading={loading}
      />

      <Confirm
        id="ringtone-menu"
        keepMounted
        open={dialogOpen}
        onClose={handleDialogClose}
        // value={value}
        message={`The dataset contains ${errorRowCount} records with validation errors and these records will be excluded when dataset is ingested. Do you still want to continue?`}
      />
    </>
  );
};
