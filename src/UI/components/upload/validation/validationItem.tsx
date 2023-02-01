import { Typography } from '@mui/material';

export default function Validationitem({
  item,
}: {
  item: String;
}) {
  return (
  <Typography color='red' sx={{margin:1, height:'50%'}}>
    {item}
  </Typography>
  );
}
