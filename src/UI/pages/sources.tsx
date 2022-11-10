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
import SourceTable from '../components/sources/source_table';
import SectionPanel from '../components/layout/sectionPanel';

export default function SourcesPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getSourceInfo());
  }, [dispatch]);

  return (
    <div>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <SectionPanel title='Reference List'>
            <SourceTable />
          </SectionPanel>
        </Container>
      </main>
    </div>
  )
}