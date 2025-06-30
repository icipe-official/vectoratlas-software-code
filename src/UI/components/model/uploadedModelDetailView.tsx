import {
  AppBar,
  Badge,
  Box,
  Button,
  CardHeader,
  FormLabel,
  IconButton,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import UploadedModelForm from './uploadedModelForm';
import { useRouter } from 'next/router';
import { UploadedModelLogList } from './uploadedModelLogList';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { UploadedModelActionMenu } from './UploadedModelActionMenu';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { RolesEnum, UploadedModelStatusEnum } from '../../state/state.types';
import { useTranslations } from 'next-intl';
import { deleteModel } from '../../state/uploadedModel/actions/uploaded-model.action';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import ClearIcon from '@mui/icons-material/Clear';

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

export const UploadedModelDetailView = () => {
  const t = useTranslations('UploadedModelDetailPage');
  const dispatch = useAppDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const router = useRouter();
  const modelId = router.query.id as string;
  const userRoles = useAppSelector((state) => state.auth.roles);
  const isInternalUser =
    (userRoles || []).includes(RolesEnum.ADMIN) ||
    (userRoles || []).includes(RolesEnum.REVIEWER) ||
    (userRoles || []).includes(RolesEnum.REVIEWER_MANAGER);
  const model = useAppSelector(
    (state) => state.uploadedModel.currentUploadedModel
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

  const doDelete = async () => {
    setShowConfirm(false);
    await deleteUploadedModel();
  };

  const deleteUploadedModel = async () => {
    if (!modelId) {
      return;
    }
    await dispatch(deleteModel(modelId));
    router.push('/uploaded-model/list');
  };

  const DetailTitle = () => {
    return (
      <Badge color="warning" variant="dot">
        {t('toolbar.details')}
      </Badge>
    );
  };

  useEffect(() => {}, [showConfirm]);

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
            aria-label="Model details"
            sx={{ width: '95%', border: 'none' }}
          >
            <Tab label={<DetailTitle />}></Tab>
            {isInternalUser && <Tab label={t('toolbar.changeLog')}></Tab>}
          </Tabs>
          {model?.status != UploadedModelStatusEnum.REJECTED && (
            <>
              <IconButton
                size="large"
                aria-label="More actions for uploaded models"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <UploadedModelActionMenu
                inFormView
                status="Pending"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                // defaultMenu={
                //   userRoles.includes(RolesEnum.MODEL_MANAGER.toString()) ? (
                //     <MenuItem
                //       key={'delete'}
                //       onClick={async () => {
                //         setShowConfirm(true);
                //       }}
                //     >
                //       <ListItemIcon>
                //         <ClearIcon color="error" fontSize="small" />
                //       </ListItemIcon>
                //       <ListItemText>{t('toolbar.delete')}</ListItemText>
                //     </MenuItem>
                //   ) : null
                // }
              />
            </>
          )}
        </Toolbar>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        {modelId && <UploadedModelForm modelId={modelId || ''} />}
      </TabPanel>
      {isInternalUser && (
        <TabPanel value={value} index={1} dir={theme.direction}>
          {modelId && <UploadedModelLogList modelId={modelId || ''} />}
        </TabPanel>
      )}
      <ConfirmationDialog
        isOpen={showConfirm}
        title={t('confirmDeleteTitle')}
        message={t('confirmDeleteMessage')}
        onConfirm={doDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </Box>
  );
};
