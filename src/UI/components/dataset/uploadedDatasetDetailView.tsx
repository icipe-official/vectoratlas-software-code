import {
  AppBar,
  Box,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import UploadedDatasetForm from './uploadedDatasetForm';
import { useRouter } from 'next/router';
import { UploadedDatasetLogList } from './uploadedDatasetLogList';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { UploadedDatasetActionMenu } from './UploadedDatasetActionMenu';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  console.log('Index, value: ', index, value);
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`fw-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export const UploadedDatasetDetailView = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const router = useRouter();
  const datasetId = router.query.id as string;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        flexGrow: 1,
        border: '1px solid #eee',
        marginTop: 10,
      }}
    >
      <AppBar position="static" color="inherit" sx={{ border: 'none' }}>
        <Toolbar>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="secondary"
            variant="fullWidth"
            aria-label="Dataset details"
            sx={{ width: '95%', border: 'none' }}
          >
            <Tab label="Details"></Tab>
            <Tab label="Logs"></Tab>
          </Tabs>

          {/* <div> */}
          <IconButton
            size="large"
            aria-label="More actions for uploaded datasets"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          {/* {anchorEl && ( */}
          <UploadedDatasetActionMenu
            status="Pending"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          />
          {/* )} */}
          {/* <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>

            </Menu> */}
          {/* </div> */}
        </Toolbar>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        {datasetId && <UploadedDatasetForm datasetId={datasetId || ''} />}
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        {datasetId && <UploadedDatasetLogList datasetId={datasetId || ''} />}
      </TabPanel>
    </Box>
  );
};
