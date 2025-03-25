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

import { Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
const descriptions: {
  OCCURRENCE: string;
  OCCURRENCE_BIONOMICS: string;
  OCCURRENCE_IR: string;
  OCCURRENCE_BIONOMICS_IR: string;
} = {
  OCCURRENCE: "Download occurrence data",
  OCCURRENCE_BIONOMICS: "Download occurrence and bionomics data",
  OCCURRENCE_IR: "Download occurrence and insecticide resistance data",
  OCCURRENCE_BIONOMICS_IR: "Download occurrence, bionomics, and insecticide resistance data",
};


const OCCURRENCE = 1;
const OCCURRENCE_BIONOMICS = 2;
const OCCURRENCE_IR = 3;
const OCCURRENCE_BIONOMICS_IR = 4;

const templateTypes: Record<keyof typeof descriptions, number> = {
  OCCURRENCE: OCCURRENCE,
  OCCURRENCE_BIONOMICS: OCCURRENCE_BIONOMICS,
  OCCURRENCE_IR: OCCURRENCE_IR,
  OCCURRENCE_BIONOMICS_IR: OCCURRENCE_BIONOMICS_IR,
};


function DataHubPanel() {
  const dispatch = useAppDispatch();
  const templateList = useAppSelector((s) => s.upload.templateList);
  const [openTooltip, setOpenTooltip] = useState<{ [key: string]: boolean }>({});
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);
  const items: { key: keyof typeof descriptions; label: string }[] = [
    { key: "OCCURRENCE", label: "Occurrence" },
    { key: "OCCURRENCE_BIONOMICS", label: "Occurrence & Bionomics" },
    { key: "OCCURRENCE_IR", label: "Occurrence & Insecticide Resistance" },
    { key: "OCCURRENCE_BIONOMICS_IR", label: "Occurrence, Bionomics & Insecticide Resistance" },
  ];

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
            <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} aria-label="contacts">
              {items.map((item, index) => (
                <div key={item.key}>
                  <ListItem disablePadding>
                    <Tooltip title={descriptions[item.key]} arrow>
                      <ListItemButton onClick={() => handleDownload(templateTypes[item.key])}>
                        <ListItemIcon>
                          <DownloadIcon />
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </Tooltip>
                    <IconButton edge="end" onClick={() => setSelectedInfo(descriptions[item.key])}>
                      <Tooltip title="More Info" arrow>
                        <InfoIcon />
                      </Tooltip>
                    </IconButton>
                  </ListItem>
                  {index < items.length - 1 && <Divider variant="inset" component="li" />}
                </div>
              ))}
            </List>

            {/* Dialog to show More Info */}
            <Dialog open={!!selectedInfo} onClose={() => setSelectedInfo(null)}>
              <DialogTitle>More Information</DialogTitle>
              <DialogContent>
                <p>{selectedInfo}</p>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedInfo(null)} color="primary">Close</Button>
              </DialogActions>
            </Dialog>          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DataHubPanel;
