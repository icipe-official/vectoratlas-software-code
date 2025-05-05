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

const OCCURRENCE = 1;
const OCCURRENCE_BIONOMICS = 2;
const OCCURRENCE_IR = 3;
const OCCURRENCE_BIONOMICS_IR = 4;

function DataHubPanel() {
  const dispatch = useAppDispatch();
  const templateList = useAppSelector((s) => s.upload.templateList);

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
          })
        );
        break;
      case OCCURRENCE_BIONOMICS:
        dispatch(
          downloadTemplate({
            dataType: 'bionomics',
            dataSource: 'Vector Atlas',
          })
        );
        break;
      case OCCURRENCE_IR:
        dispatch(
          downloadTemplate({
            dataType: 'insecticide_resistance',
            dataSource: 'Vector Atlas',
          })
        );
        break;
      case OCCURRENCE_BIONOMICS_IR:
        dispatch(
          downloadTemplate({
            dataType: 'VA',
            dataSource: 'Vector Atlas',
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
            <div>
              <strong>Welcome !. </strong> What operation do you want to perform
              ?
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} md={4}>
        <h3 color="primary" style={{ textAlign: 'center', marginBottom: 0 }}>
          Upload Model
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
              Upload Data
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
              Download Data Template With Guidance Included
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
                  <ListItemText primary="Occurence" />
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
                  <ListItemText primary="Occurrence & Bionomics" />
                </ListItemButton>
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleDownload(OCCURRENCE_IR)}>
                  <ListItemIcon>
                    <DownloadIcon />
                  </ListItemIcon>
                  <ListItemText primary="Occurrence & Insecticide Resistance" />
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
                  <ListItemText primary="Occurrence, Bionomics & Insecticide Resistance" />
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
