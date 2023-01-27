import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Grid,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { downloadTemplate } from '../../../state/upload/actions/downloadTemplate';

export default function TemplateDownload() {
  const [dataType, setDataType] = useState('');
  const [dataSource, setDataSource] = useState('');
  const dispatch = useAppDispatch();
  const templateList = useAppSelector((s) => s.upload.templateList);

  const handleDownload = () => {
    console.log(dataType, dataSource);
    dispatch(downloadTemplate({ dataType, dataSource }));
  };

  return (
    <Accordion sx={{ marginTop: '30px' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Data Templates</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column">
          <Typography>
            Data must be uploaded in the correct format to be accepted by the
            system.{' '}
          </Typography>
          <Typography sx={{ paddingBottom: '10px' }}>
            Templates are available for different data types and sources:{' '}
          </Typography>
          <Grid container direction="row" alignItems="center">
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="select-helper-label-source">
                Data Source
              </InputLabel>
              <Select
                labelId="select-helper-label-source"
                value={dataSource}
                label="Data source"
                onChange={(e) => setDataSource(e.target.value)}
                sx={{ width: '150px' }}
              >
                {templateList.map(template => <MenuItem value={template}>{template}</MenuItem>)}
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
            <Button
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
      </AccordionDetails>
    </Accordion>
  );
}
