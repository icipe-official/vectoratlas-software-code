import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { marked } from 'marked';
import { ComposeMessageForm } from '../../components/email/composeForm';
import AuthWrapper from '../../components/shared/AuthWrapper';
import SectionPanel from '../../components/layout/sectionPanel';
import {
  buildUnifiedRecipients,
  sendNewEmail,
  UnifiedRecipient,
  apiUrl,
} from '../../api/api';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { getMessages } from '../../utils/localization';
import { getUserRoles } from '../../state/admin/actions/admin.actions';

const ComposePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const platformUsers = useAppSelector((state) => state.admin.users);

  const [recipientsList, setRecipientsList] = useState<UnifiedRecipient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      dispatch(getUserRoles());
    }
  }, [dispatch, token]);

  useEffect(() => {
    const loadRecipients = async () => {
      if (!token || typeof token !== 'string' || token.trim() === '') {
        return;
      }

      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const restRes = await axios.get(`${apiUrl}subscribers`, config);
        const subscribers = restRes.data?.data || restRes.data || [];

        const mergedList = buildUnifiedRecipients(platformUsers, subscribers);
        setRecipientsList(mergedList);
      } catch (err) {
        console.error('Failed to load recipients:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecipients();
  }, [token, platformUsers]);

  const handleSend = async (data: {
    subject: string;
    recipients: string[];
    message: string;
  }) => {
    setLoading(true);
    try {
      const htmlBody = await marked(data.message);
      await sendNewEmail({
        subject: data.subject,
        recipients: data.recipients,
        message: htmlBody,
      });
      toast.success('Message sent successfully!');
      router.push('/communication-log');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper role="admin">
      <ComposeMessageForm
        loading={loading}
        recipientsList={recipientsList}
        onSend={handleSend}
      />
    </AuthWrapper>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default ComposePage;
