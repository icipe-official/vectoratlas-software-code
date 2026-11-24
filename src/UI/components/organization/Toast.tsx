// components/organizations/Toast.tsx
// Dark toast with a green tick, matching the "Reference 1047 updated successfully" message.
import { Box, IconButton, Snackbar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

export interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export const closedToast: ToastState = {
  open: false,
  message: '',
  severity: 'success',
};

interface Props {
  toast: ToastState;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: Props) {
  const Icon = toast.severity === 'success' ? CheckCircleIcon : ErrorIcon;
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={4500}
      onClose={(_, reason) => {
        if (reason !== 'clickaway') onClose();
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 10 }}
    >
      <Box
        role="status"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minWidth: 300,
          maxWidth: 420,
          px: 2,
          py: 1.5,
          color: '#fff',
          bgcolor: '#1f2623',
          borderRadius: 1.5,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        }}
      >
        <Icon
          sx={{ color: toast.severity === 'success' ? '#2ecc71' : '#ff6b81' }}
        />
        <Box sx={{ flex: 1, fontSize: 15, lineHeight: 1.4 }}>
          {toast.message}
        </Box>
        <IconButton
          size="small"
          aria-label="Close"
          onClick={onClose}
          sx={{ color: '#fff' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );
}
