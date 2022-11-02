import { Grid, Box, Typography } from '@mui/material';

export default function SingleSource({
  author,
  article_title,
  journal_title,
  citation,
  year,
  published,
  report_type,
  v_data,
}: {
  author: string;
  article_title: string;
  journal_title: string;
  citation: string;
  year: number;
  published: boolean;
  report_type: string;
  v_data: boolean;
}) {
  return (
    
    <Grid data-testid={`sourceContainer_${citation}`}>
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
              {author}
            </Typography>
          </Typography>
        </Grid>
        <Grid item md={12} lg={7}>
          <Typography variant="h6" color="primary" py="15px" px="15px">
            JOURNAL TITLE:
            <Typography variant="subtitle1" color="black">
              {journal_title}
            </Typography>
          </Typography>
        </Grid>
        <Grid item md={12} lg={12}>
          <Typography variant="h6" color="primary" py="15px" px="15px">
            CITATION:
            <Typography variant="subtitle1" color="black">
              {citation}
            </Typography>
          </Typography>
        </Grid>
        <Grid item md={12} lg={7}>
          <Typography variant="h6" color="primary" py="15px" px="15px">
            YEAR:
            <Typography variant="subtitle1" color="black">
              {year}{' '}
            </Typography>
          </Typography>
        </Grid>
        <Grid item md={12} lg={7}>
          <Typography variant="h6" color="primary" py="15px" px="15px">
            PUBLISHED:
            <Typography variant="subtitle1" color="black">
              {published}{' '}
            </Typography>
          </Typography>
        </Grid>
      </Box>
    </Grid>
  );
}
