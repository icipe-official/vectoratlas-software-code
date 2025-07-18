import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SectionPanel from '../components/layout/sectionPanel';
import AuthWrapper from '../components/shared/AuthWrapper';
import ModelUpload from '../components/upload/models/modelUpload';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import TranslationForm from '../components/translations/translation-form';
import LabelsEn from '../messages/en.json';

function TranslationsEditPage() {
  const t = useTranslations('TranslationsPage');

  const [labels, setLabels] = useState(LabelsEn || {});

  const jsonData = {
    name: 'John Doe',
    age: 30,
    address: {
      street: '123 Main St',
      city: 'Anytown',
      zip: '12345',
    },
    hobbies: ['reading', 'coding', 'hiking'],
    isStudent: false,
  };

  function renderJsonToHtml(data: any, indent = 0) {
    let html = '';
    const indentSpace = '  '.repeat(indent); // For visual indentation

    if (Array.isArray(data)) {
      html += `${indentSpace}<ul>\n`;
      data.forEach((item) => {
        html += `${indentSpace}  <li>\n`;
        html += renderJsonToHtml(item, indent + 1);
        html += `${indentSpace}  </li>\n`;
      });
      html += `${indentSpace}</ul>\n`;
    } else if (typeof data === 'object' && data !== null) {
      html += `${indentSpace}<div>\n`;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          html += `${indentSpace}  <strong>${key}:</strong>\n`;
          html += renderJsonToHtml(data[key], indent + 1);
        }
      }
      html += `${indentSpace}</div>\n`;
    } else {
      // Handle primitive types (string, number, boolean, null)
      html += `${indentSpace}<span>${data}</span>\n`;
    }
    return html;
  }

  useEffect(() => {
    setLabels(labels);
  }, [LabelsEn]);
  return (
    <div>
      <main>
        <Container
          sx={{
            padding: '10px',
            maxWidth: '75%',
          }}
        >
          <SectionPanel title={t('title')}>
            <AuthWrapper role="admin">
              <TranslationForm labels={labels} />
            </AuthWrapper>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default TranslationsEditPage;
