import { useEffect, useState } from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useTranslations } from 'next-intl';

type Props = {
  isOpen: boolean;
  message: string;
  title: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

function ConfirmationDialog(props: Props) {
  const t = useTranslations('ConfirmDialog');
  //local states
  const [open, setOpen] = useState(props.isOpen);

  const showDialog = () => {
    setOpen(true);
  };

  const hideDialog = () => {
    props?.onCancel?.();
    setOpen(false);
  };

  const confirmRequest = () => {
    props?.onConfirm?.();
    hideDialog();
    setOpen(false);
  };

  useEffect(() => {
    setOpen(props.isOpen);
  }, [props.isOpen]);

  return (
    <>
      {/* {props.children(showDialog)} */}
      {open && (
        <Dialog
          open={open}
          onClose={hideDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {props.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={confirmRequest} color="error">
              {t('yes')}
            </Button>
            <Button variant="contained" onClick={hideDialog} color="primary">
              {t('no')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default ConfirmationDialog;
