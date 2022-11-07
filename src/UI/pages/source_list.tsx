import { useEffect, useState } from 'react';
import { Paper, Typography, Box, Button, Container, Grid } from '@mui/material';
import { getSourceInfo } from '../state/sourceSlice';
import { AppDispatch } from '../state/store';
import { useAppSelector } from '../state/hooks';
import { useDispatch } from 'react-redux';
import SingleSource from '../components/sources/singleSource';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../components/sources/loader';
import EndMsg from '../components/sources/endMsg';

function SourcesView(): JSX.Element {
  const source_info = useAppSelector((state) => state.source.source_info);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getSourceInfo());
    setnoMore(false);
  }, [dispatch]);

  const refresh = () => {};
  const [noMore, setnoMore] = useState(true);

  return (
    <>
      <InfiniteScroll
        dataLength={source_info.length}
        next={() => {
          dispatch(getSourceInfo());
        }}
        hasMore={noMore}
        loader={<Loader />}
        endMessage={<EndMsg />}
        refreshFunction={refresh}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>Release to refresh</h3>
        }
      >
        <main>
          <Paper>
            <Container
              maxWidth={false}
              sx={{
                padding: '10px',
                maxWidth: '75%',
              }}
            >
              <Grid
                container
                item
                spacing={0.5}
                lg={8}
                md={12}
                sx={{ justifyContent: 'center' }}
              >
                <div>
                  <Typography variant="h4" color="primary" pb={3}>
                    <strong>LIST OF SOURCES</strong>
                  </Typography>

                  {source_info.map((source_info) => (
                    <SingleSource key={source_info.citation} {...source_info} />
                  ))}
                </div>
              </Grid>
            </Container>
          </Paper>
        </main>
      </InfiniteScroll>
    </>
  );
}

export default SourcesView;
