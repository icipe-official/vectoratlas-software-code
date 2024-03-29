import { Box, TextField } from '@mui/material';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../state/hooks';
import { getSourceInfo } from '../../state/source/actions/getSourceInfo';
import {
  changeFilterId,
  changeFilterText,
} from '../../state/source/sourceSlice';

const getStartId = (range: string) => {
  return parseInt(range.substring(0, range.indexOf('-')));
};
const getEndId = (range: string) => {
  return parseInt(range.substring(range.indexOf('-') + 1, range.length));
};

export default function SourceFilters(): JSX.Element {
  const dispatch = useAppDispatch();

  const [idError, setIdError] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const idHandler = useCallback(
    debounce((value) => {
      let startId;
      let endId;
      if (value.includes('-')) {
        startId = isNaN(getStartId(value)) ? null : getStartId(value);
        endId = isNaN(getEndId(value)) ? null : getEndId(value);
      } else {
        startId = isNaN(parseInt(value)) ? null : parseInt(value);
        endId = startId;
      }
      if (value && !startId && !endId) {
        setIdError(true);
      } else {
        setIdError(false);
        dispatch(changeFilterId({ startId, endId }));
        dispatch(getSourceInfo());
      }
    }, 1000),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const textHandler = useCallback(
    debounce((value) => {
      dispatch(changeFilterText(value));
      dispatch(getSourceInfo());
    }, 1000),
    []
  );

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    idHandler(event.target.value);
  };
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    textHandler(event.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '50%',
        alignItems: 'flex-end',
        paddingBottom: '10px',
        float: 'right',
      }}
    >
      <TextField
        id="id-filter"
        data-testid="id-filter"
        label={
          idError
            ? 'Please enter range (e.g. 100-200)'
            : 'Filter by id (e.g. 100-200)'
        }
        variant="standard"
        sx={{ paddingRight: '20px' }}
        onChange={handleIdChange}
        error={idError}
      />
      <TextField
        id="title-filter"
        data-testid="title-filter"
        sx={{ width: '60%' }}
        label="Filter by Title"
        variant="standard"
        onChange={handleTitleChange}
      />
    </Box>
  );
}
