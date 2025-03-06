import React from 'react';
import AboutHeader from '../../about/aboutHeader';
import { Typography } from '@mui/material';
import SectionPanel from '../../../components/layout/sectionPanel';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Props {
  id: string;
  title: string;
}

export default function UploadSuccess(props: Props) {
  return (
    <main>
      <SectionPanel title="Upload Success">
        <CheckCircleIcon color="primary" sx={{ fontSize: 100 }} />
        <Typography variant="body1" sx={{ paddingBottom: 3 }}>
          Your dataset has been uploaded and will be reviewed. You can keep
          track of the status by going to
          <Link href={`/uploaded-dataset/${props.id}`} passHref>
            <a style={{ color: 'blue' }}> Uploaded Dataset Page</a>
          </Link>
        </Typography>
      </SectionPanel>
    </main>
  );
}
