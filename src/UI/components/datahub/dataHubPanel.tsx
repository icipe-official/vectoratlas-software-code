import React from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import DownloadIcon from '@mui/icons-material/Download';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { downloadTemplate } from '../../state/upload/actions/downloadTemplate';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useTranslations } from 'next-intl';

const OCCURRENCE = 1;
const OCCURRENCE_BIONOMICS = 2;
const OCCURRENCE_IR = 3;
const OCCURRENCE_BIONOMICS_IR = 4;
const GUIDANCE = 5;

// Icons: 80px on phones so two fit side by side with room to spare, 100px from sm up
const iconBoxSx = {
  mt: 1,
  cursor: 'pointer',
  '& img': {
    width: { xs: 80, sm: 100 },
    height: 'auto',
  },
};

// Headings: a little more space below, slightly smaller text on phones
const headingStyle = {
  textAlign: 'center',
  margin: 0,
  marginBottom: 8,
  fontSize: '1.1rem',
} as const;

function DataHubPanel() {
  const t = useTranslations('DataHubPage');
  const dispatch = useAppDispatch();
  const templateList = useAppSelector((s) => s.upload.templateList);
  const { user } = useUser();

  // const handleDownload = () => {
  //   dispatch(downloadTemplate({ dataType: 'VA', dataSource: 'Vector Atlas' }));
  // };
  const handleDownload = (templateType: number) => {
    switch (templateType) {
      case OCCURRENCE:
        dispatch(
          downloadTemplate({
            dataType: 'occurrence',
            dataSource: 'Vector Atlas',
            extension: 'xlsx',
          })
        );
        break;
      case OCCURRENCE_BIONOMICS:
        dispatch(
          downloadTemplate({
            dataType: 'bionomics',
            dataSource: 'Vector Atlas',
            extension: 'xlsx',
          })
        );
        break;
      case OCCURRENCE_IR:
        dispatch(
          downloadTemplate({
            dataType: 'IR_Bioassays',
            dataSource: 'Vector Atlas',
            extension: 'xlsx',
          })
        );
        break;
      case OCCURRENCE_BIONOMICS_IR:
        dispatch(
          downloadTemplate({
            dataType: 'VA',
            dataSource: 'Vector Atlas',
            extension: 'xlsx',
          })
        );
        break;
      case GUIDANCE:
        dispatch(
          downloadTemplate({
            dataType: 'guidance',
            dataSource: 'Vector Atlas',
            extension: 'xlsx',
          })
        );
        break;
    }
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid item xs={12}>
        <div>{t('intro')}</div>
      </Grid>

      {/* Upload Model and Upload Data share a row on phones, each taking half the width */}
      <Grid item xs={6} md={4}>
        <h3 color="primary" style={headingStyle}>
          {t('uploadModel')}
        </h3>
        <Box
          data-testid="upload_model"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...iconBoxSx,
          }}
        >
          <Link href="/model_upload" passHref>
            <a>
              <Image
                src="/upload.png"
                width={100}
                height={100}
                alt="Upload Model Button"
              />
            </a>
          </Link>
        </Box>
      </Grid>

      <Grid item xs={6} md={4}>
        <h3 color="primary" style={headingStyle}>
          {t('uploadData')}
        </h3>
        <Box
          data-testid="upload_data"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...iconBoxSx,
          }}
        >
          <Link href="/upload" passHref>
            <a>
              <Image
                src="/upload2.png"
                width={100}
                height={100}
                alt="Upload Data Button"
              />
            </a>
          </Link>
        </Box>
      </Grid>

      {/* On phones, extra top margin separates this section from the icons above */}
      <Grid item xs={12} md={4} sx={{ mt: { xs: 4, md: 0 } }}>
        <Grid container direction="column" sx={{ alignItems: 'center' }}>
          <h3 color="primary" style={headingStyle}>
            {t('downloadTemplate')}
          </h3>
          <List
            dense
            sx={{
              width: '100%',
              maxWidth: 360,
              bgcolor: 'background.paper',
              py: 0,
            }}
            aria-label="contacts"
          >
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleDownload(OCCURRENCE)}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DownloadIcon />
                </ListItemIcon>
                <ListItemText primary={t('template.occurrence')} />
              </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleDownload(OCCURRENCE_BIONOMICS)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DownloadIcon />
                </ListItemIcon>
                <ListItemText primary={t('template.occurenceBionomics')} />
              </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleDownload(OCCURRENCE_IR)}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DownloadIcon />
                </ListItemIcon>
                <ListItemText primary={t('template.occurrenceIR')} />
              </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleDownload(OCCURRENCE_BIONOMICS_IR)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DownloadIcon />
                </ListItemIcon>
                <ListItemText primary={t('template.occurrenceBionomicsIR')} />
              </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleDownload(GUIDANCE)}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DownloadIcon />
                </ListItemIcon>
                <ListItemText primary="Guidance" />
              </ListItemButton>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DataHubPanel;
