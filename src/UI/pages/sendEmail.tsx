import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import SectionPanel from '../components/layout/sectionPanel';
import ReviewForm from '../components/review/ReviewForm';
import AuthWrapper from '../components/shared/AuthWrapper';
import SendMail from '../components/sendMail/sendMail';
import EmailPopup from '../components/sendMail/sendMail';
import { useState } from 'react';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';

const SendEmail = () => {
  const router = useRouter();

  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsEmailPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsEmailPopupOpen(false);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <button onClick={handleOpenPopup}>Open Email Form</button>

      {/* Reusable EmailPopup component */}
      <EmailPopup isOpen={isEmailPopupOpen} onClose={handleClosePopup} />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default SendEmail;
