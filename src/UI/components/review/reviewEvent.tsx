import { ReviewEvent } from './ReviewForm';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';

export function ReviewEventItem({ event }: { event: ReviewEvent }) {
  const theme = useTheme();
  const eventString = `${event.type} by ${event.performedBy} on ${event.performedAt}.`;
  return (
    <ListItem>
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: 'auto',
          justifyContent: 'center',
        }}
      >
        {event.type === 'Uploaded' ? (
          <FileUploadIcon
            sx={{ color: theme.palette.secondary.main, margin: '5px' }}
          />
        ) : event.type === 'Reviewed' ? (
          <RemoveRedEyeIcon sx={{ color: 'blue', margin: '5px' }} />
        ) : (
          <DoneOutlineIcon
            sx={{ color: theme.palette.primary.main, margin: '5px' }}
          />
        )}
      </ListItemIcon>
      <ListItemText primary={eventString} />
    </ListItem>
  );
}
