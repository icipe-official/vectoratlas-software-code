import { ReviewEvent } from "./ReviewForm";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { ListItem, ListItemIcon, ListItemText, useTheme } from "@mui/material";

export function ReviewEventItem({event}) {
  const theme = useTheme();
  const eventString = `${event.type} by ${event.performedBy} on ${event.performedAt}.`
  return (

    <ListItem>
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: 'auto',
          justifyContent: 'center',
        }}
      >
        {event.type === 'Uploaded' ? <FileUploadIcon sx={{color: theme.palette.secondary.main}}/> :
          event.type === 'Reviewed' ? <RemoveRedEyeIcon sx={{color: 'blue'}} /> :
          <DoneOutlineIcon  sx={{color: theme.palette.primary.main}}/>}
      </ListItemIcon>
      <ListItemText primary={eventString} />
    </ListItem>
  )
}