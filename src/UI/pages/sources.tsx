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

function SourcesPage(): JSX.Element {
  const source_info = useAppSelector((state) => state.source.source_info);

  return (
    <div>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: isMatch ? null : '75%',
            margin: 0,
          }}
        >
  )
}