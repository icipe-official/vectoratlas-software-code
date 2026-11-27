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
        // Less bottom padding on phones
        paddingBottom: { xs: '8px', sm: '20px' },
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <TextField
        id="species-search-filter"
        sx={{
          // Full width on phones, original 40% from sm up
          width: { xs: '100%', sm: '40%' },
          minWidth: { xs: 0, sm: '200px' },
        }}
        // Cleaned up text placeholder binding
        label={t('filters.searchPlaceholder') || 'Search species...'}
        variant="outlined"
        size="small"
        value={searchVal}
        onChange={handleTextChange}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          // Wrap instead of overflowing the card
          flexWrap: 'wrap',
          gap: 1,
          width: { xs: '100%', sm: 'auto' },
          minWidth: 0,
        }}
      >
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
          sx={{
            minWidth: 0,
            // Compact buttons on phones, original size from sm up
            '& .MuiToggleButton-root': {
              padding: { xs: '4px 10px', sm: '7px 11px' },
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
            },
          }}
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
