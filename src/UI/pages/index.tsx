import { Button, Container, Grid } from "@mui/material";
import dynamic from 'next/dynamic';
import AboutBanner from "../components/home/aboutBanner";
import NewsBox from "../components/home/newsBox";
import StatsBox from "../components/home/statsBox";
import { useAppSelector } from "../state/hooks";
import { is_flag_on } from '../utils/utils';

const MapBox = dynamic(() => import("../components/home/mapBox"), { ssr: false });

function Home(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);

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
              {is_flag_on(feature_flags, "HOME_NEWS") && <NewsBox /> }
              {is_flag_on(feature_flags, "HOME_STATS") && <StatsBox /> }
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
