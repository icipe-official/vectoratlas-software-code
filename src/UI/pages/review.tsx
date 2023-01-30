import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import SectionPanel from '../components/layout/sectionPanel';
import ReviewForm from '../components/review/ReviewForm';
import AuthWrapper from '../components/shared/AuthWrapper';

function Review() {
  const router = useRouter();
  const { dataset } = router.query;

  return (
    <div>
      <Container>
        <SectionPanel title="Review dataset">
          <AuthWrapper role="reviewer">
            <ReviewForm datasetId={dataset} />
          </AuthWrapper>
        </SectionPanel>
      </Container>
    </div>
  );
}

export default Review;
