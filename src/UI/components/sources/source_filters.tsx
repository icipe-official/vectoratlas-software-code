import { Box, TextField } from '@mui/material';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../state/hooks';
import { getSourceInfo } from '../../state/source/actions/getSourceInfo';
import {
  changeFilterId,
  changeFilterText,
} from '../../state/source/sourceSlice';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

const getStartId = (range: string) => {
  return parseInt(range.substring(0, range.indexOf('-')));
};
const getEndId = (range: string) => {
  return parseInt(range.substring(range.indexOf('-') + 1, range.length));
};

export default function SourceFilters(): JSX.Element {
  const t = useTranslations('SourcesPage');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const hasNumIds = typeof router.query.num_ids === 'string';

  const [idError, setIdError] = useState(false);

  const idHandler = useCallback(
    debounce((value: string) => {
      if (hasNumIds) return;

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
    [dispatch, hasNumIds]
  );

  const textHandler = useCallback(
    debounce((value: string) => {
      if (hasNumIds) return;

      dispatch(changeFilterText(value));
      dispatch(getSourceInfo());
    }, 1000),
    [dispatch, hasNumIds]
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
        display: hasNumIds ? 'none' : 'flex',
        width: '50%',
        alignItems: 'flex-end',
        paddingBottom: '10px',
        float: 'right',
      }}
    >
      <TextField
        id="id-filter"
        data-testid="id-filter"
        label={idError ? t('filters.errorMsg') : t('filters.idFilter')}
        variant="standard"
        sx={{ paddingRight: '20px' }}
        onChange={handleIdChange}
        error={idError}
        disabled={hasNumIds}
      />
      <TextField
        id="title-filter"
        data-testid="title-filter"
        sx={{ width: '60%' }}
        label={t('filters.titleFilter')}
        variant="standard"
        onChange={handleTitleChange}
        disabled={hasNumIds}
      />
    </Box>
  );
}
