import {
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { downloadTemplate } from '../../../state/upload/actions/downloadTemplate';

export default function TemplateDownload() {
  const [dataType, setDataType] = useState('');
  const [dataSource, setDataSource] = useState('');
  const dispatch = useAppDispatch();
  const templateList = useAppSelector((s) => s.upload.templateList);

  const handleDownload = () => {
    dispatch(downloadTemplate({ dataType, dataSource }));
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" sx={{ marginBottom: 3 }} color="primary.main">
        Templates
      </Typography>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            Data must be uploaded in the correct format to be accepted by the
            system
          </Typography>
          <Typography sx={{ marginBottom: 2 }} variant="body1">
            The dropdowns below will allow you to select the one most
            appropriate for your needs...
          </Typography>
        </Grid>
        <Grid item direction="column" alignItems="center">
          <FormControl sx={{ m: 1, marginLeft: 0, minWidth: 120 }}>
            <InputLabel id="select-helper-label-source">Data Source</InputLabel>
            <Select
              labelId="select-helper-label-source"
              value={dataSource}
              label="Data source"
              onChange={(e) => setDataSource(e.target.value)}
              sx={{ width: '150px' }}
            >
              {templateList.map((template) => (
                <MenuItem key={template} value={template}>
                  {template}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="select-helper-label-type">Data Type</InputLabel>
            <Select
              labelId="select-helper-label-type"
              value={dataType}
              label="Data type"
              onChange={(e) => setDataType(e.target.value)}
              sx={{ width: '150px' }}
            >
              <MenuItem value={'bionomics'}>Bionomics</MenuItem>
              <MenuItem value={'occurrence'}>Occurrence</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            sx={{ marginLeft: 0 }}
            component="label"
            variant="contained"
            onClick={handleDownload}
            data-testid="downloadButton"
            disabled={dataType === '' || dataSource === ''}
          >
            Download template
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
