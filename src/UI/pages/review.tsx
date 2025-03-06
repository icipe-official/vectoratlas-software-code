import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import SectionPanel from '../components/layout/sectionPanel';
import ReviewForm from '../components/review/ReviewForm';
import AuthWrapper from '../components/shared/AuthWrapper';
import { RolesEnum } from '../state/state.types';

function Review() {
  const router = useRouter();
  const dataset = router.query.dataset as string;

  return (
    <div>
      <Container>
        <SectionPanel title="Data review">
          <AuthWrapper role={RolesEnum.REVIEWER}>
            <ReviewForm datasetId={dataset} />
          </AuthWrapper>
        </SectionPanel>
      </Container>
    </div>
  );
}

export default Review;
