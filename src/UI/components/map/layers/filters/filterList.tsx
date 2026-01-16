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
import DataArrayIcon from '@mui/icons-material/DataArray';
import ScienceIcon from '@mui/icons-material/Science';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import BugReportIcon from '@mui/icons-material/BugReport';
import PestControlIcon from '@mui/icons-material/PestControl';
import EggIcon from '@mui/icons-material/Egg';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import FilterDropDown from './filterDropDown';
import FilterToggle from './filterToggle';
import DateFilter from './dateFilter';
import { drawerListToggle, drawerToggle } from '../../../../state/map/mapSlice';
import Grid from '@mui/material/Grid';
import { AreaFilters } from './areaFilter';
import { Info } from '@mui/icons-material';
import { Typography, Divider, Box } from '@mui/material';
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
    if (open === true) {
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
          alignItems: 'center',
          paddingX: 2.5,
          paddingBottom: 2.5,
          width: '100%',
        }}
      >
        {/* Info Banner */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            borderRadius: 1,
            padding: 1.5,
            marginBottom: 2.5,
            width: '100%',
            border: '1px solid rgba(25, 118, 210, 0.2)',
          }}
        >
          <Info color="primary" sx={{ fontSize: '1.1rem', mr: 1 }} />
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {t('filterList.noFilters')}
          </Typography>
        </Box>

        {/* Location Filters Section */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              mb: 1,
              display: 'block',
            }}
          >
            Location
          </Typography>
          <FilterDropDown
            filterTitle={t('filterList.titles.country')}
            filterName="country"
          />
          <Box sx={{ mt: 1.5 }}>
            <FilterDropDown
              filterTitle={t('filterList.titles.species')}
              filterName="species"
              prefix="An. "
            />
          </Box>
          <Box sx={{ mt: 1.5 }}>
            <AreaFilters />
          </Box>
        </Box>

        <Divider sx={{ width: '100%', my: 2 }} />

        {/* Environmental & Resistance Filters Section */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              mb: 1.5,
              display: 'block',
            }}
          >
            Environmental & Resistance
          </Typography>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <FilterToggle
                filterTitle={t('filterList.titles.season')}
                filterName="season"
                filterToggleType={'string'}
                filterOptionsArray={[
                  {
                    name: 'rainy',
                    optionIcon: <ThunderstormIcon />,
                    displayName: t('filterList.display.rainy'),
                  },
                  {
                    name: 'dry',
                    optionIcon: <WbSunnyIcon />,
                    displayName: t('filterList.display.dry'),
                  },
                ]}
                hasEmpty
              />
            </Grid>

            <Grid item md={6}>
              <FilterToggle
                filterTitle={t('filterList.titles.insecticide')}
                filterName="insecticide"
                filterToggleType={'string'}
                filterOptionsArray={[
                  {
                    name: 'phenotypic',
                    optionIcon: <FingerprintIcon />,
                    displayName: t('filterList.display.phenotypic'),
                  },
                  {
                    name: 'genotypic',
                    optionIcon: <HourglassEmptyIcon />,
                    displayName: t('filterList.display.genotypic'),
                  },
                ]}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ width: '100%', my: 2 }} />

        {/* Data Type Filters Section */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              mb: 1.5,
              display: 'block',
            }}
          >
            Data Types
          </Typography>
          <Grid container spacing={1.5}>
            <Grid item md={12}>
              <FilterToggle
                filterTitle={t('filterList.titles.control')}
                filterName="control"
                filterToggleType={'boolean'}
                filterOptionsArray={[
                  {
                    name: 'true',
                    optionIcon: null,
                    displayName: '✓',
                  },
                ]}
              />
            </Grid>

            <Grid item md={12}>
              <FilterToggle
                filterTitle={t('filterList.titles.adult')}
                filterName="isAdult"
                filterToggleType={'boolean'}
                filterOptionsArray={[
                  {
                    name: 'true',
                    optionIcon: null,
                    displayName: '✓',
                  },
                ]}
              />
            </Grid>

            <Grid item md={12}>
              <FilterToggle
                filterTitle={t('filterList.titles.larval')}
                filterName="isLarval"
                filterToggleType={'boolean'}
                filterOptionsArray={[
                  {
                    name: 'true',
                    optionIcon: null,
                    displayName: '✓',
                  },
                ]}
              />
            </Grid>

            <Grid item md={12}>
              <FilterToggle
                filterTitle={t('filterList.titles.binaryPresence')}
                filterName="binary_presence"
                filterToggleType={'string'}
                filterOptionsArray={[
                  {
                    name: 'True',
                    optionIcon: null,
                    displayName: '✓',
                  },
                ]}
              />
            </Grid>

            <Grid item md={12}>
              <FilterToggle
                filterTitle={t('filterList.titles.abundanceData')}
                filterName="abundance_data"
                filterToggleType={'string'}
                filterOptionsArray={[
                  {
                    name: 'True',
                    optionIcon: null,
                    displayName: '✓',
                  },
                ]}
              />
            </Grid>

            <Grid item md={12}>
              <FilterToggle
                filterTitle={t('filterList.titles.bionomics')}
                filterName="bionomics"
                filterToggleType={'string'}
                filterOptionsArray={[
                  {
                    name: 'true',
                    optionIcon: null,
                    displayName: '✓',
                  },
                ]}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ width: '100%', my: 2 }} />

        {/* Time Range Filter Section */}
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              mb: 1.5,
              display: 'block',
            }}
          >
            Time Period
          </Typography>
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