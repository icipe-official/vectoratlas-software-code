import {
  Button,
  Container,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MapBanner from '../components/home/mapBanner';
import NewsBox from '../components/home/newsBox';
import StatsBox from '../components/home/statsBox';
import AboutBanner from '../components/home/aboutBanner';
import { is_flag_on } from '../utils/utils';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../state/hooks';

function Home(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const feature_flags = useAppSelector((state) => state.config.feature_flags);

  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: isMobile ? null : '100%',
          }}
        >
          <MapBanner />
          {isMobile ? <AboutBanner/> : <></>}
          <Grid container direction={'column'} spacing={2}>
            <Grid item md={12} lg={6}>
              {is_flag_on(feature_flags, 'HOME_STATS') && <StatsBox />}
            </Grid>
            <Grid item md={12} lg={6}>
              {is_flag_on(feature_flags, 'HOME_NEWS') && <NewsBox />}
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default Home;
