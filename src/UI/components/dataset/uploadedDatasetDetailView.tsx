import {
  AppBar,
  Badge,
  Box,
  FormLabel,
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
import { useAppSelector } from '../../state/hooks';
import { RolesEnum, UploadedDatasetStatusEnum } from '../../state/state.types';
import { useTranslations } from 'next-intl';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
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
  const t = useTranslations('UploadedDatasetDetailPage');

  const [value, setValue] = useState(0);
  const theme = useTheme();
  const router = useRouter();
  const datasetId = router.query.id as string;
  const userRoles = useAppSelector((state) => state.auth.roles);
  const isInternalUser =
    (userRoles || []).includes(RolesEnum.ADMIN) ||
    (userRoles || []).includes(RolesEnum.REVIEWER) ||
    (userRoles || []).includes(RolesEnum.REVIEWER_MANAGER);
  const dataset = useAppSelector(
    (state) => state.uploadedDataset.currentUploadedDataset
  );
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

  const DetailTitle = () => {
    return (
      <Badge color="warning" variant="dot">
        {t('toolbar.details')}
      </Badge>
    );
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
            <Tab label={<DetailTitle />}></Tab>
            {isInternalUser && <Tab label={t('toolbar.changeLog')}></Tab>}
          </Tabs>
          {dataset?.status != UploadedDatasetStatusEnum.REJECTED && (
            <>
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
              <UploadedDatasetActionMenu
                inFormView
                status="Pending"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              />
            </>
          )}
        </Toolbar>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        {datasetId && <UploadedDatasetForm datasetId={datasetId || ''} />}
      </TabPanel>
      {isInternalUser && (
        <TabPanel value={value} index={1} dir={theme.direction}>
          {datasetId && <UploadedDatasetLogList datasetId={datasetId || ''} />}
        </TabPanel>
      )}
    </Box>
  );
};
