import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../../state/hooks';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import FilterListIcon from '@mui/icons-material/FilterList';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Info from '@mui/icons-material/Info';
import { MultipleFilterToggle as FilterToggle } from './filterToggle';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterDropDown from './filterDropDown';
import { AreaFilters } from './areaFilter';
import DateFilter from './dateFilter';
import {
  drawerListToggle,
  drawerToggle,
  setSpeciesPopupOpen,
} from '../../../../state/map/mapSlice';
import { Typography, Box, Tooltip } from '@mui/material';
import { useTranslations } from 'next-intl';

interface FilterListProps {
  sectionTitle: string;
  sectionFlag: 'filters' | 'overlays' | 'baseMap' | 'download';
}

export const FilterList: React.FC<FilterListProps> = ({
  sectionTitle,
  sectionFlag,
}) => {
  const t = useTranslations('MapPage');
  const dispatch = useAppDispatch();

  /* ---------------- Redux State Selectors ---------------- */
  const open = useAppSelector((state) => state.map.map_drawer.open);
  const isOpen = useAppSelector((state) => state.map.map_drawer[sectionFlag]);
  const filters = useAppSelector((state) => state.map.filters);

  const handleToggle = () => {
    if (open) {
      dispatch(drawerListToggle(sectionFlag));
    } else {
      dispatch(drawerToggle());
      dispatch(drawerListToggle(sectionFlag));
    }
  };

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        onClick={handleToggle}
        selected={isOpen}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          py: 1.5,
          '&.Mui-selected': {
            backgroundColor: 'rgba(74, 222, 128, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(74, 222, 128, 0.12)',
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          <FilterAltIcon />
        </ListItemIcon>

        <ListItemText
          primary={sectionTitle}
          sx={{ opacity: open ? 1 : 0 }}
          primaryTypographyProps={{
            fontWeight: 500,
            // color: isOpen ? '#4ade80' : '#e8f5ec'
          }}
        />
        {isOpen && open ? <ExpandLess /> : null}
        {!isOpen && open ? <ExpandMore /> : null}
      </ListItemButton>

      <Collapse
        data-testid={`${sectionFlag}ListContainer`}
        in={isOpen && open}
        timeout="auto"
        unmountOnExit
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingX: 2.5,
          paddingBottom: 2.5,
          width: '100%',
        }}
      >
        {/* ================= Country ================= */}
        <Box sx={{ mb: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography
              sx={{ fontSize: '1rem', fontWeight: 500, color: 'primary.main' }}
            >
              {t('filterList.titles.country')}:
            </Typography>
            <Tooltip title={t('filterList.tooltips.country')}>
              <Info
                color="primary"
                sx={{ fontSize: '1.1rem', cursor: 'pointer' }}
              />
            </Tooltip>
          </Box>
          <FilterDropDown filterTitle="" filterName="country" />
        </Box>

        {/* ================= Species ================= */}
        <Box sx={{ mb: 2 }}>
          <Typography
            data-testid="speciesPopupTrigger"
            onClick={() => {
              // Keeps drawer open, fires action to mount/display floating species box over Leaflet Map
              dispatch(setSpeciesPopupOpen(true));
            }}
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: 'primary.main',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'color 0.2s ease, opacity 0.2s ease',
              '&:hover': {
                color: '#4ade80',
                opacity: 0.85,
              },
              '&:active': {
                opacity: 0.7,
              },
            }}
          >
            {t('filterList.titles.species')}:
            {filters?.species?.value?.length > 0 && (
              <Typography
                component="span"
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#4ade80',
                  ml: 1,
                  backgroundColor: 'rgba(74, 222, 128, 0.1)',
                  px: 1,
                  py: 0.2,
                  borderRadius: '4px',
                }}
              >
                {filters.species.value.length} selected
              </Typography>
            )}
          </Typography>
        </Box>

        {/* ================= Area ================= */}
        <Box sx={{ mb: 2 }}>
          <AreaFilters />
        </Box>

        {/* ================= Season ================= */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: 'primary.main',
              mb: 1,
            }}
          >
            {t('filterList.titles.season')}:
          </Typography>
          <FilterToggle
            filterTitle=""
            filterName="season"
            filterToggleType="string"
            filterOptionsArray={[
              {
                name: 'rainy',
                optionIcon: <ThunderstormIcon sx={{ fontSize: '1.2rem' }} />,
                displayName: t('filterList.display.rainy').toUpperCase(),
              },
              {
                name: 'dry',
                optionIcon: <WbSunnyIcon sx={{ fontSize: '1.2rem' }} />,
                displayName: t('filterList.display.dry').toUpperCase(),
              },
            ]}
            hasEmpty={false}
          />
        </Box>

        {/* ================= Insecticide ================= */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: 'primary.main',
              mb: 1,
            }}
          >
            {t('filterList.titles.insecticide')}:
          </Typography>
          <FilterToggle
            filterTitle=""
            filterName="insecticide"
            filterToggleType="string"
            filterOptionsArray={[
              {
                name: 'phenotypic',
                optionIcon: <FingerprintIcon sx={{ fontSize: '1.2rem' }} />,
                displayName: t('filterList.display.phenotypic').toUpperCase(),
                tooltip: t('filterList.tooltips.pheno'),
              },
              {
                name: 'genotypic',
                optionIcon: <HourglassEmptyIcon sx={{ fontSize: '1.2rem' }} />,
                displayName: t('filterList.display.genotypic').toUpperCase(),
                tooltip: t('filterList.tooltips.geno'),
              },
            ]}
            hasEmpty={false}
          />
        </Box>

        {/* ================= Binary Presence ================= */}
        <Box sx={{ mb: 1.5 }}>
          <FilterToggle
            filterTitle="Absence data:"
            filterName="binary_presence"
            filterToggleType="string"
            filterOptionsArray={[
              { name: 'False', optionIcon: null, displayName: '✓' },
            ]}
            hasEmpty={false}
          />
        </Box>

        {/* ================= Abundance ================= */}
        <Box sx={{ mb: 1.5 }}>
          <FilterToggle
            filterTitle="Abundance data:"
            filterName="binary_presence"
            filterToggleType="string"
            filterOptionsArray={[
              { name: 'True', optionIcon: null, displayName: '✓' },
            ]}
            hasEmpty={true}
          />
        </Box>

        {/* ================= Bionomics ================= */}
        <Box sx={{ mb: 1.5 }}>
          <FilterToggle
            filterTitle="Bionomics data:"
            filterName="bionomics"
            filterToggleType="boolean"
            filterOptionsArray={[
              { name: 'true', optionIcon: null, displayName: '✓' },
            ]}
            tooltip={t('filterList.tooltips.bionomics')}
            hasEmpty={false}
          />
        </Box>

        {/* ================= Adult ================= */}
        <Box sx={{ mb: 1.5 }}>
          <FilterToggle
            filterTitle="Adult data:"
            filterName="isAdult"
            filterToggleType="boolean"
            filterOptionsArray={[
              { name: 'true', optionIcon: null, displayName: '✓' },
            ]}
            hasEmpty={false}
          />
        </Box>

        {/* ================= Larval ================= */}
        <Box sx={{ mb: 2 }}>
          <FilterToggle
            filterTitle="Larval data:"
            filterName="isLarval"
            filterToggleType="boolean"
            filterOptionsArray={[
              { name: 'true', optionIcon: null, displayName: '✓' },
            ]}
            hasEmpty={false}
          />
        </Box>

        {/* ================= Time ================= */}
        <Box>
          <DateFilter
            filterTitle={t('filterList.titles.time')}
            filterName="timeRange"
          />
        </Box>
      </Collapse>
    </ListItem>
  );
};

export default FilterList;
