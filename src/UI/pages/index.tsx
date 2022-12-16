import {
  Button,
  Container,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AboutBanner from '../components/home/aboutBanner';
import NewsBox from '../components/home/newsBox';
import StatsBox from '../components/home/statsBox';
import MapBox from '../components/home/mapBox';
import { is_flag_on } from '../utils/utils';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { getAllData } from '../state/config/actions/getAllData';

function Home(): JSX.Element {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleUpload = () => router.push('/upload');
  const handleSource = () => router.push('/new_source');

  const feature_flags = useAppSelector((state) => state.config.feature_flags);
  const dispatch = useAppDispatch();

  const clickHandle = () => {
    dispatch(getAllData());
  };

  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            padding: '10px',
            maxWidth: isMobile ? null : '75%',
          }}
        >
          <AboutBanner />
          <Grid container spacing={2}>
            <Grid item md={12} lg={7}>
              {is_flag_on(feature_flags, 'HOME_NEWS') && <NewsBox />}
            </Grid>
            <Grid item md={12} lg={5}>
              <MapBox />
              <Grid
                container
                justifyContent="space-between"
                style={{ paddingBottom: 15, paddingTop: 15 }}
              >
                <Button variant="contained" size="large" onClick={handleUpload}>
                  Upload Data
                </Button>
                <Button onClick={clickHandle} variant="outlined" size="large">
                  Download Data
                </Button>
                <Button variant="outlined" size="large">
                  Download Maps
                </Button>
              </Grid>
              {is_flag_on(feature_flags, 'HOME_STATS') && <StatsBox />}
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default Home;
