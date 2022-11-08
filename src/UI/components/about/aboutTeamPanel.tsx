import { Grid, Avatar, Box } from '@mui/material';

export default function AboutTeamPanel({
  id,
  name,
  location,
  position,
  imageURL,
  description,
}: {
  id: number;
  name: string;
  location: string;
  position: string;
  imageURL: string;
  description: string;
}) {
  return (
    <Grid
      data-testid={`teamMemberContainer_${id}`}
      container
      item
      lg={6}
      md={12}
      sx={{ justifyContent: 'center' }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          width: 1,
          padding: 2,
          borderRadius: 5,
          border: 2,
          borderColor: 'primary.main',
        }}
      >
        <Grid container>
          <Grid
            item
            xs={6}
            sx={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <Avatar
              data-testid={`profileImage_${id}`}
              sx={{ height: 120, width: 120 }}
              alt={name}
              src={imageURL}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: 'inline-flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ fontWeight: 'bold', color: 'primary.main' }}>{name}</Box>
            <Box sx={{ fontWeight: 'Medium', marginBottom: 2 }}>{location}</Box>
            <Box sx={{ fontSize: '12px' }}>{position}</Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ fontSize: '12px', paddingTop: 3, minHeight: 130 }}>
              {description}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}
