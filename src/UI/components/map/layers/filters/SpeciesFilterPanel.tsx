import React, { useState, useCallback } from 'react';
import { Box, Checkbox, Collapse, Typography, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  primarySpeciesList,
  secondarySpeciesList,
} from '../../../../state/map/utils/countrySpeciesLists';

interface SpeciesFilterPanelProps {
  selectedSpecies: string[];
  onChange: (selected: string[]) => void;
  onClose: () => void;
}

interface FilterDropdownSectionProps {
  title: string;
  speciesItems: string[];
  isPrimary: boolean;
  selectedSpecies: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelectAll: (items: string[], checked: boolean) => void;
  onItemToggle: (item: string, checked: boolean) => void;
}

// Inline helper to ensure safe case-insensitive filtering
const normalizeString = (val: string) =>
  String(val ?? '')
    .trim()
    .toLowerCase();

const FilterDropdownSection: React.FC<FilterDropdownSectionProps> = ({
  title,
  speciesItems,
  isPrimary,
  selectedSpecies,
  isOpen,
  onToggle,
  onSelectAll,
  onItemToggle,
}) => {
  // Safe validation: Force safe conversion if an upstream component passes an invalid type
  const safeSelectedArray = Array.isArray(selectedSpecies)
    ? selectedSpecies
    : [];

  // Normalize the selected tracking array for fast lookup times inside loops
  const normalizedSelectedSet = React.useMemo(() => {
    return new Set(safeSelectedArray.map(normalizeString));
  }, [safeSelectedArray]);

  // Count matches specifically inside this single section group
  const sectionSelected = (speciesItems || []).filter((s) =>
    normalizedSelectedSet.has(normalizeString(s))
  );
  const isAllChecked =
    speciesItems.length > 0 && sectionSelected.length === speciesItems.length;
  const isIndeterminate = sectionSelected.length > 0 && !isAllChecked;

  return (
    <Box sx={{ mb: 1.25 }}>
      {/* Header bar for dropdown sections */}
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.5,
          py: 1.25,
          cursor: 'pointer',
          background: isOpen
            ? 'rgba(74, 222, 128, 0.04)'
            : 'rgba(255, 255, 255, 0.02)',
          borderRadius: '8px',
          border: isOpen
            ? '1px solid rgba(74, 222, 128, 0.25)'
            : '1px solid rgba(255, 255, 255, 0.05)',
          '&:hover': {
            background: 'rgba(74, 222, 128, 0.08)',
            borderColor: 'rgba(74, 222, 128, 0.35)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
        >
          <Checkbox
            size="small"
            checked={isAllChecked}
            indeterminate={isIndeterminate}
            onChange={(e) => onSelectAll(speciesItems, e.target.checked)}
            sx={{
              p: 0.5,
              color: 'rgba(143, 186, 154, 0.3)',
              '&.Mui-checked': { color: '#4ade80' },
              '&.MuiCheckbox-indeterminate': { color: '#4ade80' },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: isOpen ? '#ffffff' : '#e8f5ec',
              fontWeight: 600,
              fontSize: '13.5px',
              userSelect: 'none',
            }}
          >
            {title}
          </Typography>

          {/* Dynamic badge counts visible when collapsed or expanded */}
          {sectionSelected.length > 0 && (
            <Box
              sx={{
                ml: 0.75,
                px: 1,
                py: 0.15,
                borderRadius: '20px',
                background: 'rgba(74, 222, 128, 0.18)',
                color: '#4ade80',
                fontSize: '11px',
                fontWeight: 700,
                border: '1px solid rgba(74, 222, 128, 0.3)',
                boxShadow: '0 0 10px rgba(74, 222, 128, 0.1)',
              }}
            >
              {sectionSelected.length}
            </Box>
          )}
        </Box>

        <Box sx={{ color: '#4ade80', display: 'flex', alignItems: 'center' }}>
          {isOpen ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )}
        </Box>
      </Box>

      {/* Checkbox child nodes wrapper */}
      <Collapse in={isOpen} timeout={200} unmountOnExit>
        <Box
          sx={{
            pl: 1.75,
            pr: 1,
            py: 0.75,
            borderLeft: '1px dashed rgba(74, 222, 128, 0.25)',
            ml: 2.25,
            my: 0.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            maxHeight: '220px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: '5px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(74, 222, 128, 0.15)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(74, 222, 128, 0.3)',
            },
          }}
        >
          {(speciesItems || []).map((item) => {
            const isChecked = normalizedSelectedSet.has(normalizeString(item));
            return (
              <Box
                key={item}
                onClick={() => onItemToggle(item, !isChecked)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 0.6,
                  px: 1,
                  borderRadius: '6px',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <Checkbox
                  size="small"
                  checked={isChecked}
                  onChange={(e) => {
                    e.stopPropagation();
                    onItemToggle(item, e.target.checked);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    p: 0.5,
                    mr: 1,
                    color: 'rgba(143, 186, 154, 0.25)',
                    '&.Mui-checked': { color: '#4ade80' },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: isChecked ? '#4ade80' : '#8fba9a',
                    fontSize: '13px',
                    fontWeight: isChecked || isPrimary ? 600 : 400,
                    fontStyle: 'italic',
                    userSelect: 'none',
                  }}
                >
                  An. {item.replace(/_/g, ' ')}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

export const SpeciesFilterPanel: React.FC<SpeciesFilterPanelProps> = ({
  selectedSpecies = [],
  onChange,
  onClose,
}) => {
  const [primaryOpen, setPrimaryOpen] = useState(true);
  const [secondaryOpen, setSecondaryOpen] = useState(false);

  // Absolute type guard fallback to avoid mapping errors on initial loads
  const safeSelectedSpecies = Array.isArray(selectedSpecies)
    ? selectedSpecies
    : [];

  const handleSelectAllSection = useCallback(
    (items: string[], checked: boolean) => {
      const currentSelected = Array.isArray(selectedSpecies)
        ? selectedSpecies
        : [];
      if (checked) {
        const normalizedCurrent = currentSelected.map(normalizeString);
        const uniqueToAdd = items.filter(
          (item) => !normalizedCurrent.includes(normalizeString(item))
        );
        onChange([...currentSelected, ...uniqueToAdd]);
      } else {
        const itemsToClearSet = new Set(items.map(normalizeString));
        onChange(
          currentSelected.filter(
            (s) => !itemsToClearSet.has(normalizeString(s))
          )
        );
      }
    },
    [selectedSpecies, onChange]
  );

  const handleItemToggle = useCallback(
    (item: string, checked: boolean) => {
      const currentSelected = Array.isArray(selectedSpecies)
        ? selectedSpecies
        : [];
      if (checked) {
        onChange([...currentSelected, item]);
      } else {
        const targetNormalized = normalizeString(item);
        onChange(
          currentSelected.filter((s) => normalizeString(s) !== targetNormalized)
        );
      }
    },
    [selectedSpecies, onChange]
  );

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '25px',
        left: '25px',
        zIndex: 1100,
        width: '320px',
        background: 'rgba(20, 26, 24, 0.95)',
        backdropFilter: 'blur(25px)',
        borderRadius: '16px',
        border: '1px solid rgba(74, 222, 128, 0.25)',
        boxShadow: '0 16px 48px 0 rgba(0, 0, 0, 0.75)',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header element overlay bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          pb: 1,
          borderBottom: '1px solid rgba(74, 222, 128, 0.15)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              display: 'flex',
              p: 0.75,
              borderRadius: '8px',
              background: 'rgba(74, 222, 128, 0.1)',
            }}
          >
            <FilterListIcon sx={{ color: '#4ade80', fontSize: '18px' }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: '#e8f5ec',
                fontSize: '14.5px',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Species Filters
            </Typography>
            <Typography
              sx={{
                color: '#4ade80',
                fontSize: '11px',
                fontWeight: 500,
                mt: 0.25,
              }}
            >
              Vector Map Overlays
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: 'rgba(143, 186, 154, 0.6)',
            '&:hover': {
              color: '#4ade80',
              background: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Internal Dropdown Groups Container scroll row */}
      <Box sx={{ overflowY: 'auto', maxHeight: '50vh', pr: 0.5 }}>
        <FilterDropdownSection
          title="Primary Species"
          speciesItems={primarySpeciesList}
          isPrimary={true}
          selectedSpecies={safeSelectedSpecies}
          isOpen={primaryOpen}
          onToggle={() => setPrimaryOpen(!primaryOpen)}
          onSelectAll={handleSelectAllSection}
          onItemToggle={handleItemToggle}
        />

        <FilterDropdownSection
          title="Secondary Species"
          speciesItems={secondarySpeciesList}
          isPrimary={false}
          selectedSpecies={safeSelectedSpecies}
          isOpen={secondaryOpen}
          onToggle={() => setSecondaryOpen(!secondaryOpen)}
          onSelectAll={handleSelectAllSection}
          onItemToggle={handleItemToggle}
        />
      </Box>
    </Box>
  );
};
