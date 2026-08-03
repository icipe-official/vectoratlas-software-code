import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../state/hooks';
import { getSourceInfo } from '../../state/source/actions/getSourceInfo';
import {
  changeFilterId,
  changeFilterText,
  changeFilterField,
} from '../../state/source/sourceSlice';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

const getStartId = (range: string) => {
  return parseInt(range.substring(0, range.indexOf('-')));
};
const getEndId = (range: string) => {
  return parseInt(range.substring(range.indexOf('-') + 1, range.length));
};

// The value each option maps to must match a real column name that
// reference.service.ts's findReferences can filter against.
const FILTER_FIELD_OPTIONS = [
  { value: 'article_title', labelKey: 'filters.fieldTitle' },
  { value: 'author', labelKey: 'filters.fieldAuthor' },
  { value: 'journal_title', labelKey: 'filters.fieldJournalTitle' },
];

export default function SourceFilters(): JSX.Element {
  const t = useTranslations('SourcesPage');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const hasNumIds = typeof router.query.num_ids === 'string';

  const [idError, setIdError] = useState(false);
  const [filterField, setFilterField] = useState('article_title');

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

  const handleFieldChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setFilterField(value);
    dispatch(changeFilterField(value));
    dispatch(getSourceInfo());
  };

  return (
    <Box
      sx={{
        display: hasNumIds ? 'none' : 'flex',
        width: '60%',
        alignItems: 'stretch',
        paddingBottom: '10px',
        float: 'right',
        gap: 0,
      }}
    >
      <Select
        value={filterField}
        onChange={handleFieldChange}
        disabled={hasNumIds}
        size="small"
        sx={{
          minWidth: 160,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          '.MuiOutlinedInput-notchedOutline': {
            borderRight: 'none',
          },
        }}
      >
        {FILTER_FIELD_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {t(option.labelKey)}
          </MenuItem>
        ))}
      </Select>
      <TextField
        id="title-filter"
        data-testid="title-filter"
        sx={{
          width: '100%',
          '.MuiOutlinedInput-root': {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        }}
        size="small"
        placeholder={t('filters.searchPlaceholder')}
        variant="outlined"
        onChange={handleTitleChange}
        disabled={hasNumIds}
      />
    </Box>
  );
}
