import { useEffect } from 'react';
import { Container } from '@mui/material';
import { getSourceInfo } from '../state/sourceSlice';
import { AppDispatch } from '../state/store';
import { useDispatch } from 'react-redux';
import SectionPanel from '../components/layout/sectionPanel';
import dynamic from 'next/dynamic';

const SourceTableNoSsr = dynamic(() => import('../components/sources/source_table'), { ssr: false });

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
            <SourceTableNoSsr />
          </SectionPanel>
        </Container>
      </main>
    </div>
  )
}