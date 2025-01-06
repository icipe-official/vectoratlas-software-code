import { Alert, Slide, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface CustomizedSnackBarProps {
  autoHideDuration: number;
  onClose: (evt: any, reason: string) => void;
  updateParentStateHandler: () => void;
  message: string;
  open: boolean;
}

function SlideTransition(props: any) {
  return <Slide {...props} direction="up" />;
}

export const CustomizedSnackBar = (props: CustomizedSnackBarProps) => {
  const [open, setOpen] = useState(props.open);

  const handleClose = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    props.onClose(event, reason);
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
        onClose={(evt) => handleClose(evt, props.message)}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={(evt) => handleClose(evt, props.message)}
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
