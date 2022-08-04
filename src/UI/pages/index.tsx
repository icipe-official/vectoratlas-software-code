import { Container, Grid } from "@mui/material";
import AboutBanner from "../components/home/aboutBanner";
import MapBox from "../components/home/mapBox";
import NewsBox from "../components/home/newsBox";
import StatsBox from "../components/home/statsBox";

function Home(): JSX.Element {
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
              <Grid item xs={6}>
                <StatsBox />
                <NewsBox />
              </Grid>
              <Grid item xs={6}>
                <MapBox />
              </Grid>
            </Grid>
        </Container>
      </main>
    </div>
  );
}

export default Home;
