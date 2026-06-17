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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Info from '@mui/icons-material/Info';
import { MultipleFilterToggle as FilterToggle } from './filterToggle';
import FilterDropDown from './filterDropDown';
import { AreaFilters } from './areaFilter';
import DateFilter from './dateFilter';
import { drawerListToggle, drawerToggle } from '../../../../state/map/mapSlice';
import { Typography, Box, Tooltip } from '@mui/material'; // Added Tooltip here
import { useTranslations } from 'next-intl';

export const FilterList = ({
  sectionTitle,
  sectionFlag,
}: {
  sectionTitle: string;
  sectionFlag: string;
}) => {
  const t = useTranslations('MapPage');
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.map.map_drawer.open);
  const openFilterPanel = useAppSelector(
    (state) => state.map.map_drawer.filters
  );

  const handleClick = () => {
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
        data-testid={`${sectionFlag}Button`}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
        onClick={handleClick}
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
        <ListItemText primary={sectionTitle} sx={{ opacity: open ? 1 : 0 }} />
        {openFilterPanel && open ? <ExpandLess /> : null}
        {!openFilterPanel && open ? <ExpandMore /> : null}
      </ListItemButton>

      <Collapse
        data-testid={`${sectionFlag}ListContainer`}
        in={openFilterPanel}
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
        <Box sx={{ mb: 2 }}>
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
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: 'primary.main',
              mb: 1,
            }}
          >
            {t('filterList.titles.species')}:
          </Typography>
          <FilterDropDown filterTitle="" filterName="species" prefix="An. " />
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
            filterName="abundance_data"
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
