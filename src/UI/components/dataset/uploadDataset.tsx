import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormLabel,
  Hidden,
  InputBaseProps,
  InputProps,
  Paper,
  TextField,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import { SaveOutlined } from '@mui/icons-material';
import { useState } from 'react';

type UploadDatasetProps = {
  is_new_upload?: boolean;
};

const UploadDataset = (props: UploadDatasetProps) => {
  const [readonly, setReadOnly] = useState<boolean>(
    !props.is_new_upload || false
  );
  const handleSubmit = () => {
    alert('Submitting data');
  };

  const inputProps: InputProps = {
    readOnly: readonly,
  };

  return (
    <div>
      <Container>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '100ch' },
            maxWidth: '100%',
            bgcolor: '#fff',
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              required
              fullWidth
              label="Dataset title"
              id="title"
              InputProps={inputProps}
            />
          </div>
          <div>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Dataset description"
              id="description"
              InputProps={inputProps}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Enter existing DOI, if any"
              id="provided_doi"
              InputProps={inputProps}
            />
          </div>
          <div>
            {/* <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload CSV File */}
            <TextField
              label="Upload CSV file"
              type="file"
              // onChange={(event) => console.log(event.target.files)}
              InputProps={inputProps}
            />
            {/* </Button> */}
          </div>
          <div>
            {!readonly && (
              <Button
                component="label"
                role={undefined}
                variant="contained"
                type="submit"
                startIcon={<SaveOutlined />}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default UploadDataset;
