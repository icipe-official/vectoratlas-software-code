import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React from 'react';

export default function FileUploader() {
  return (
    <form>
      <TextField type="file" />
      <Button variant="contained" component="span">
        Upload
      </Button>
    </form>
  );
}
