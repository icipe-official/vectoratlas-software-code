import { Button, Container, Grid } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0';
import AboutBanner from '../components/home/aboutBanner';
import NewsBox from '../components/home/newsBox';
import StatsBox from '../components/home/statsBox';
import MapBox from '../components/home/mapBox';
import { useAppSelector } from '../state/hooks';
import { is_flag_on } from '../utils/utils';

function Home(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <div>
      <main >
        <Container maxWidth={false}
          sx={{
            padding: '10px',
            maxWidth: '75%'
          }}>
          <AboutBanner />
          <Grid container spacing={2}>
            <Grid item xs={7}>
              {is_flag_on(feature_flags, 'HOME_NEWS') && <NewsBox /> }
              {is_flag_on(feature_flags, 'HOME_STATS') && <StatsBox /> }
            </Grid>
            <Grid item xs={5}>
              <MapBox />
              <Grid container justifyContent="space-between">
                <Button variant="contained" size="large">Upload Data</Button>
                <Button variant="outlined" size="large">Download Data</Button>
                <Button variant="outlined" size="large">Download Maps</Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default Home;
