import { Grid, Box, Typography } from '@mui/material';
import { Source } from '../../state/sourceSlice';

export default function SingleSource(source: Source) {
  return (
    <Grid data-testid={'sourceContainer'}>
      <Box
        p="100px"
        sx={{
          width: 1,
          padding: 2,
          borderRadius: 10,
          border: 2,
          borderColor: 'primary.main',
          boxSizing: 'inherit',
          marginBottom: 5,
        }}
      >
        <Grid item md={12} lg={4} xs={6}>
          <Typography variant="h6" color="primary" py="15px" px="15px">
            AUTHOR:
            <Typography variant="subtitle1" color="black">
              {source.author}
            </Typography>
          </Typography>
        </Grid>
        <Grid item md={12} lg={7}>
          <Typography variant="h6" color="primary" py="15px" px="15px">
            JOURNAL TITLE:
            <Typography variant="subtitle1" color="black">
              {source.journal_title}
            </Typography>
          </Typography>
        </Grid>
        <Grid item md={12} lg={12}>
          <Typography variant="h6" color="primary" py="15px" px="15px">
            CITATION:
            <Typography variant="subtitle1" color="black">
              {source.citation}
            </Typography>
          </Typography>
        </Grid>
        <Grid item md={12} lg={7}>
          <Typography variant="h6" color="primary" py="15px" px="15px">
            YEAR:
            <Typography variant="subtitle1" color="black">
              {source.year}
            </Typography>
          </Typography>
        </Grid>
        <Grid item md={12} lg={7}>
          <Typography variant="h6" color="primary" py="15px" px="15px">
            PUBLISHED:
            <Typography variant="subtitle1" color="black">
              {source.published}
            </Typography>
          </Typography>
        </Grid>
      </Box>
    </Grid>
  );
}
