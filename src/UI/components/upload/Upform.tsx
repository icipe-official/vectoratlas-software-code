import { Button, Grid, AppBar, Toolbar, Container, Box } from '@mui/material';
import { upload } from '@testing-library/user-event/dist/types/setup/directApi';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';

function Upform() {
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openFailure, setOpenFailure] = React.useState(false);

  const handleClick = () => {
    if (upload_data()) {
      setOpenSuccess(true);
    } else {
      setOpenFailure(true);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
    setOpenFailure(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const upload_data = () => {
    // call endpoint here for reall upload process
    return true;
  };

  return (
    <form>
      <Box sx={{ height: '75%' }}>
        <input type="file" name="csv"></input>
        <Button variant="contained" onClick={handleClick} size="large">
          Submit
        </Button>
        <Snackbar
          open={openSuccess}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Upload successfull"
          action={action}
        />
        <Snackbar
          open={openFailure}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Upload Failed"
          action={action}
        />
      </Box>
    </form>
  );
}

export default Upform;
