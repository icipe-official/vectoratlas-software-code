import { Alert, Slide, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface CustomizedSnackBarProps {
  autoHideDuration: number;
  onClose: (evt, reason) => void;
  updateParentStateHandler: () => void;
  message: string;
  open: boolean;
}

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export const CustomizedSnackBar = (props: CustomizedSnackBarProps) => {
  const [open, setOpen] = useState(props.open);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.onClose();
    props.updateParentStateHandler();
    setOpen(false);
  };

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={props.autoHideDuration}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
