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

// "5-10" -> 5
const getStartId = (range: string) => {
  return parseInt(range.substring(0, range.indexOf('-')));
};
// "5-10" -> 10
const getEndId = (range: string) => {
  return parseInt(range.substring(range.indexOf('-') + 1, range.length));
};

// Values must match real column names that findReferences can filter on.
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
    // Outer row: full width, pushes the filter to the right
    <Box
      sx={{
        display: hasNumIds ? 'none' : 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        boxSizing: 'border-box',
        paddingBottom: '10px',
      }}
    >
      {/* Inner bar: fills the row, capped on large screens */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          width: '100%',
          maxWidth: 600,
          minWidth: 0,
          gap: 0,
        }}
      >
        <Select
          value={filterField}
          onChange={handleFieldChange}
          disabled={hasNumIds}
          size="small"
          sx={{
            // Fluid: ~30% of the bar, clamped between 110px and 180px
            width: 'clamp(110px, 30%, 180px)',
            flexShrink: 0,
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
            // Takes the remaining space; minWidth 0 lets it shrink
            flex: 1,
            minWidth: 0,
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
    </Box>
  );
}
