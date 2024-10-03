import React, { useState } from 'react';
import UploadDataset from './uploadDataset';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import { UploadedDatasetLog } from './uploadedDatasetLog';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RuleIcon from '@mui/icons-material/Rule';
import { CustomizedSnackBar } from '../shared/CustomizedSnackBar';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface DatasetDetailsProps {
  id?: string;
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

export const UploadedDatasetDetails = (props: DatasetDetailsProps) => {
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const [autoHideDuration, setAutoHideDuration] = useState(6000);
  const [approveAlertOpen, setApproveAlertOpen] = useState(false);
  const [rejectAlertOpen, setRejectAlertOpen] = useState(false);
  const [validateAlertOpen, setValidateAlertOpen] = useState(false);

  const [dataset, setDataset] = useState(props.record || {status: "Pending"});

  const handleApproveDataset = () => {
    setApproveAlertOpen(true);
  };

  const handleRejectDataset = () => {
    setRejectAlertOpen(true);
  };

  const handleValidateDataset = () => {
    setValidateAlertOpen(true);
  };

  const getStatusIndicator = (status: string) => {
    let color = '#d9182e';
    switch (status) {
      case 'Pending':
        color = '#d9182e';
        break;
      case 'Approved':
        color = '#4caf50';
        break;

      case 'Under Review':
        color = '#ffa500';
        break;

      case 'Rejected':
        color = '#d9182e';
        break;
      case 'Rejected By Reviewer Manager':
        color = '#d9182e';
        break;
      default:
        break;
    }
    return color;
  };

  return (
    <Container>
      <Typography variant="h4">Dataset details</Typography>
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
                  <div></div>
                  <div>
                    {dataset && (
                      <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                        <FiberManualRecordIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            // color: props.status === 'connected' ? '#4caf50' : '#d9182e',
                            color: getStatusIndicator(dataset?.status),
                          }}
                        />
                        {dataset?.status}
                      </Box>
                    )}
                    {/* <Typography variant="h5">Sample dataset</Typography> */}
                    <UploadDataset />
                  </div>
                  <div style={{ width: '100%' }}>
                    <Button
                      color="primary"
                      variant="contained"
                      startIcon={<ThumbUpIcon />}
                      sx={{ width: '90%' }}
                      onClick={handleApproveDataset}
                    >
                      Approve
                    </Button>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <Button
                      color="primary"
                      variant="contained"
                      startIcon={<ThumbDownIcon />}
                      sx={{ width: '90%' }}
                      onClick={handleRejectDataset}
                    >
                      Reject
                    </Button>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <Button
                      color="primary"
                      variant="contained"
                      startIcon={<RuleIcon />}
                      sx={{ width: '90%' }}
                      onClick={handleValidateDataset}
                    >
                      Validate
                    </Button>
                  </div>
                </Box>
              </div>
            </div>
          )}

          {/* TAB 2 Contents */}
          {value === 1 && (
            <Box sx={{ p: 3, bgcolor: '#fff' }}>
              <UploadedDatasetLog />
            </Box>
          )}
        </div>
        <div>
          <CustomizedSnackBar
            open={approveAlertOpen}
            message="Dataset approved"
            autoHideDuration={autoHideDuration}
            onClose={() => {}}
            updateParentStateHandler={() => setApproveAlertOpen(false)}
          />
          <CustomizedSnackBar
            open={rejectAlertOpen}
            message="Reject dataset"
            autoHideDuration={autoHideDuration}
            onClose={() => {}}
            updateParentStateHandler={() => setRejectAlertOpen(false)}
          />
          <CustomizedSnackBar
            open={validateAlertOpen}
            message="Validate dataset"
            autoHideDuration={autoHideDuration}
            onClose={() => {}}
            updateParentStateHandler={() => setValidateAlertOpen(false)}
          />
        </div>
      </Box>
    </Container>
  );
};
