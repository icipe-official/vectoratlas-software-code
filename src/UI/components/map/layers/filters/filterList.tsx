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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import BugReportIcon from '@mui/icons-material/BugReport';
import PestControlIcon from '@mui/icons-material/PestControl';
import EggIcon from '@mui/icons-material/Egg';
import FilterDropDown from './filterDropDown';
import FilterToggle from './filterToggle';
import DateFilter from './dateFilter';
import {
  drawerListToggle,
  drawerToggle,
  getFilteredData,
} from '../../../../state/map/mapSlice';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export const FilterList = ({
  sectionTitle,
  sectionFlag,
}: {
  sectionTitle: string;
  sectionFlag: string;
}) => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.map.map_drawer.open);
  const openFilterPanel = useAppSelector(
    (state) => state.map.map_drawer.filters
  );
  const currentFilters = useAppSelector((state) => state.map.filters);

  const handleClick = () => {
    if (open === true) {
      dispatch(drawerListToggle(sectionFlag));
    } else {
      dispatch(drawerToggle());
      dispatch(drawerListToggle(sectionFlag));
    }
  };

  const handleDownload = () => {
    dispatch(getFilteredData(currentFilters));
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
          paddingX: 2,
          paddingBottom: 2,
          width: '100%',
        }}
      >
        <FilterDropDown filterTitle={'Country'} filterName="country" />
        <FilterDropDown filterTitle={'Species'} filterName="species" />
        <Grid container spacing={3}>
          <Grid item md={6}>
            <FilterToggle
              filterTitle="Season"
              filterName="season"
              filterToggleType={'string'}
              filterOptionsArray={[
                { name: 'rainy', optionIcon: <ThunderstormIcon /> },
                { name: 'dry', optionIcon: <WbSunnyIcon /> },
                { name: 'empty', optionIcon: <DataArrayIcon /> },
              ]}
            />
          </Grid>
          <Grid item md={6}>
            <FilterToggle
              filterTitle="Control"
              filterName="control"
              filterToggleType={'boolean'}
              filterOptionsArray={[
                { name: 'true', optionIcon: <DoneIcon /> },
                { name: 'false', optionIcon: <CloseIcon /> },
                { name: 'empty', optionIcon: <DataArrayIcon /> },
              ]}
            />
          </Grid>
          <Grid item md={6}>
            <FilterToggle
              filterTitle="Adult"
              filterName="isAdult"
              filterToggleType={'boolean'}
              filterOptionsArray={[
                { name: 'true', optionIcon: <EmojiNatureIcon /> },
                { name: 'false', optionIcon: <BugReportIcon /> },
                { name: 'empty', optionIcon: <DataArrayIcon /> },
              ]}
            />
          </Grid>
          <Grid item md={6}>
            <FilterToggle
              filterTitle="Larval"
              filterName="isLarval"
              filterToggleType={'boolean'}
              filterOptionsArray={[
                { name: 'true', optionIcon: <PestControlIcon /> },
                { name: 'false', optionIcon: <EggIcon /> },
                { name: 'empty', optionIcon: <DataArrayIcon /> },
              ]}
            />
          </Grid>
        </Grid>
        <DateFilter filterTitle="Time" filterName="timeRange" />
        <Button
          onClick={handleDownload}
          variant="contained"
          sx={{ margin: 0, marginTop: 2, width: '100%' }}
        >
          Download Filtered Data
        </Button>
      </Collapse>
    </ListItem>
  );
};
export default FilterList;
