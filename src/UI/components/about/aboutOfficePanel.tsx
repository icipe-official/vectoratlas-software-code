import { Grid, Typography, Box, Paper, Link as MuiLink } from '@mui/material';

export default function AboutOfficePanel({
  id,
  name,
  address,
  tel,
  fax,
  email,
}: {
  id: number;
  name: string;
  address: string;
  tel: string;
  fax: string;
  email: string;
}) {
  return (
    <Grid
      data-testid={`officeContainer_${id}`}
      container
      item
      xs={12}
      sm={6}
      md={4}
      sx={{ justifyContent: 'center', p: 2 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: '100%',
          borderRadius: 2,
          bgcolor: 'background.paper',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
        }}
      >
        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600, mb: 1 }}>
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Address:</strong> {address}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Tel:</strong> {tel}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Fax:</strong> {fax}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Email:</strong>{' '}
          <MuiLink href={`mailto:${email}`} color="secondary.main" underline="hover">
            {email}
          </MuiLink>
        </Typography>
      </Paper>
    </Grid>
  );
}
