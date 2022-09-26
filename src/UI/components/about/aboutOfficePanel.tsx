import { Grid, Typography, Box } from '@mui/material';

export default function AboutOfficePanel({ id, name, address, tel, fax, email }: { id: number; name: string; address: string; tel: string; fax: string; email: string }) {
  return (
    <Grid data-testid={`officeContainer_${id}`} container item sx={{ justifyContent: 'center' }}>
      <Box sx={{ display: 'inline-flex', flexDirection: 'column', rowGap: '3px', width: 1, cursor: 'pointer', padding: 2 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>{name}</Typography>
        <Typography sx={{ fontSize: '14px' }}>Address: {address}</Typography>
        <Typography sx={{ fontSize: '14px' }}>Tel: {tel}</Typography>
        <Typography sx={{ fontSize: '14px' }}>Fax: {fax}</Typography>
        <Typography sx={{ fontSize: '14px' }}>Email: {email}</Typography>
      </Box>
    </Grid>
  );
}
