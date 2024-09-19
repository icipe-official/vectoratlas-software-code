import { useEffect, useState } from 'react';
import { Button, Container, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { TextEditor } from '../shared/textEditor/RichTextEditor';

export default function SourcesPage(): JSX.Element {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [tittle, setTittle] = useState('');

  // Function to validate email format using regex
  const validateEmailFormat = (email: any) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const emailValid = email !== '' && validateEmailFormat(email);
  const validFormat = validateEmailFormat(email);
  const tittleValid = tittle !== '';
  const bodyValid = body !== '';

  const sendEmail = () => {
  
  }
  
  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            padding: '1px',
            maxWidth: isMatch ? null : '75%',
          }}
        >
    <div>

      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Recepient Email
      </Typography>
      <TextField
        variant="outlined"
        sx={{ width: '100%' }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!emailValid || !validFormat}
        helperText={!email ? 'Email cannot be empty' : !validFormat ? 'Provide a valid Email' : ''}
      />
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Email Tittle
      </Typography>
      <TextField
        variant="outlined"
        sx={{ width: '100%' }}
        value={tittle}
        onChange={(e) => setTittle(e.target.value)}
        error={!tittleValid}
        helperText={!tittleValid ? 'Tittle cannot be empty' : ''}
      />
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Email Body
      </Typography>
      <TextEditor
          description={body}
          setDescription={setBody}
          initialDescription=""
          error={!bodyValid}
          helperText={!bodyValid ? 'Email body cannot be empty' : ''}
        />
      </div>
      <Button
          variant="contained"
          disabled={
           !emailValid || !tittleValid || !bodyValid
          }
          onClick={sendEmail}
          sx={{ m: 1, minWidth: 150 }}
        >
         Send Email
        </Button>
        </Container>
      </main>
    </div>
  );
}
