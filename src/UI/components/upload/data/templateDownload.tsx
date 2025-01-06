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
    dispatch(downloadTemplate({ dataType: 'VA', dataSource: 'Vector Atlas' }));
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" sx={{ marginBottom: 3 }} color="primary.main">
        Templates
      </Typography>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            Here is the VA template. Conforming your data to match the template
            will make the ingestion process faster and more effecient.
          </Typography>
        </Grid>

        <Grid item>
          <Button
            sx={{ marginLeft: 0 }}
            component="label"
            variant="contained"
            onClick={handleDownload}
            data-testid="downloadButton"
          >
            Download template
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
