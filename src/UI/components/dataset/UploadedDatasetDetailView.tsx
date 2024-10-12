import React, { Fragment, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Container,
  Divider,
  Grid,
  Grow,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import { UploadedDatasetLogList } from './uploadedDatasetLogList';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RuleIcon from '@mui/icons-material/Rule';
import { CustomizedSnackBar } from '../shared/CustomizedSnackBar';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { fetchUploadedDataset } from '../../api/api';
import UploadedDatasetForm from './uploadedDatasetForm';
import { PersonAdd } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
// import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

interface DatasetDetailsProps {
  datasetId?: string;
  record?: object;
}

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#fff',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  })
);

export const UploadedDatasetDetailView = (props: DatasetDetailsProps) => {
  // const anchorRef = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const [autoHideDuration, setAutoHideDuration] = useState(6000);
  const [approveAlertOpen, setApproveAlertOpen] = useState(false);
  const [rejectAlertOpen, setRejectAlertOpen] = useState(false);
  const [validateAlertOpen, setValidateAlertOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(1);

  //const [datasetId, setDatasetId] = useState(props.datasetId || '');
  //const datasetId = props.datasetId || '';
  const [dataset, setDataset] = useState(props.record || { status: 'Pending' });

  useEffect(() => {
    handleTabChange(null, 1);
    setTimeout(() => {
      handleTabChange(null, 0);
    }, 500);
  }, []);
 

  // useEffect(() => {
  //   const getDataset = async () => {
  //     const res = await fetchUploadedDataset(datasetId);
  //     console.log('Dataset id: ', datasetId);
  //     console.log('Retrieved dataset: ', datasetId, res);
  //     setDataset(res);
  //   };
  //   getDataset();
  // }, [datasetId]);

  return (
    <Container>
      {/* <Typography variant="h4">Dataset details</Typography> */}
      <Box sx={{ bgcolor: '#2e1534' }}>
        <StyledTabs
          value={value}
          onChange={handleTabChange}
          aria-label="Dataset details"
        >
          <StyledTab label="Dataset details"></StyledTab>
          <StyledTab label="Dataset log" />
        </StyledTabs>
        <div style={{ width: '100%' }}>
          {/* TAB 1 Contents */}
          {value === 0 && (
            <div>
              <div>
                <Box
                  sx={{
                    //p: 3,,
                    bgcolor: '#fff',
                    display: 'inline-flex',
                    border: '1px solid',
                    alignItems: 'flex-start',
                    borderColor: 'divider',
                    borderRadius: 2,
                    width: '100%',
                    height: '100%',
                    //bgcolor: 'background.paper',
                    // color: 'text.secondary',
                    '& svg': {
                      m: 1,
                    },
                  }}
                >
                  <UploadedDatasetForm datasetId={props.datasetId || ''} />
                </Box>
              </div>
            </div>
          )}

          {/* TAB 2 Contents */}
          {value === 1 && (
            <Box sx={{ p: 3, bgcolor: '#fff' }}>
              <UploadedDatasetLogList datasetId={props.datasetId || ''} />
            </Box>
          )}
        </div>
      </Box>
    </Container>
  );
};
