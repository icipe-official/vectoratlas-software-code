import React, { useCallback, useState } from 'react';
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';

interface CatalogueFiltersProps {
  onSearchChange: (text: string) => void;
  onCategoryChange: (category: string) => void;
}

export default function CatalogueFilters({
  onSearchChange,
  onCategoryChange,
}: CatalogueFiltersProps): JSX.Element {
  const t = useTranslations('cataloguePage');

  const [searchVal, setSearchVal] = useState('');
  const [category, setCategory] = useState('All');

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, 400),
    [onSearchChange]
  );

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setSearchVal(val);
    debouncedSearch(val);
  };

  const handleCategoryToggle = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string | null
  ) => {
    if (newCategory !== null) {
      setCategory(newCategory);
      onCategoryChange(newCategory);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <TextField
        id="species-search-filter"
        sx={{ width: '40%', minWidth: '200px' }}
        // Cleaned up text placeholder binding
        label={t('filters.searchPlaceholder') || 'Search species...'}
        variant="outlined"
        size="small"
        value={searchVal}
        onChange={handleTextChange}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontWeight: 500 }}
        >
          {t('grid.category')}:
        </Typography>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryToggle}
          size="small"
          color="primary"
        >
          {/* Keep values as standard logical tokens, translate display text labels */}
          <ToggleButton value="All">
            {t('filters.categories.all') || 'All'}
          </ToggleButton>
          <ToggleButton value="Primary">
            {t('filters.categories.Primary') || 'Primary'}
          </ToggleButton>
          <ToggleButton value="Secondary">
            {t('filters.categories.Secondary') || 'Secondary'}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
