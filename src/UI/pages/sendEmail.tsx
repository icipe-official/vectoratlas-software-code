import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import SectionPanel from '../components/layout/sectionPanel';
import ReviewForm from '../components/review/ReviewForm';
import AuthWrapper from '../components/shared/AuthWrapper';
import SendMail from '../components/sendMail/sendMail';

function sendEmail() {
  const router = useRouter();

  return (
    <div>
      <Container>
        <SectionPanel title="Send Email">
          <AuthWrapper role="reviewer">
            <SendMail/>
          </AuthWrapper>
        </SectionPanel>
      </Container>
    </div>
  );
}

export default sendEmail;