import React from 'react';
import {
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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <div>{t('intro')}</div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} md={4}>
        <h3 color="primary" style={{ textAlign: 'center', marginBottom: 0 }}>
          {t('uploadModel')}
        </h3>
        <div
          data-testid="upload_model"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ marginTop: 15 }}>
            <Link href="/model_upload" passHref>
              <a>
                <Image
                  src="/upload.png"
                  width={100}
                  height={100}
                  style={{ cursor: 'pointer' }}
                  alt="Upload Model Button"
                />
              </a>
            </Link>
          </div>
        </div>
      </Grid>
      <Grid item sm={12} md={4}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <h3
              color="primary"
              style={{ textAlign: 'center', marginBottom: 0 }}
            >
              {t('uploadData')}
            </h3>
            <div
              data-testid="upload_data"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ marginTop: 15 }}>
                <Link href="/upload" passHref>
                  <a>
                    <Image
                      src="/upload2.png"
                      width={100}
                      height={100}
                      style={{ cursor: 'pointer' }}
                      alt="Upload Data Button"
                    />
                  </a>
                </Link>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} md={4}>
        <Grid container>
          <Grid
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              // alignItems: 'center',
              alignContent: 'flex-end',
            }}
            item
            xs={12}
            md={12}
          >
            <h3
              color="primary"
              style={{ textAlign: 'center', marginBottom: 0 }}
            >
              {t('downloadTemplate')}
            </h3>
            <List
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              aria-label="contacts"
            >
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleDownload(OCCURRENCE)}>
                  <ListItemIcon>
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
                  <ListItemIcon>
                    <DownloadIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('template.occurenceBionomics')} />
                </ListItemButton>
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleDownload(OCCURRENCE_IR)}>
                  <ListItemIcon>
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
                  <ListItemIcon>
                    <DownloadIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('template.occurrenceBionomicsIR')} />
                </ListItemButton>
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleDownload(GUIDANCE)}>
                  <ListItemIcon>
                    <DownloadIcon />
                  </ListItemIcon>
                  <ListItemText primary="Guidance" />
                </ListItemButton>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DataHubPanel;
