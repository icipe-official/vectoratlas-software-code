import { Button, Typography } from '@mui/material';

export const AboutMapOverlay = ({
  buttonColor,
  buttonText,
}: {
  buttonColor: string;
  buttonText: string;
}) => {
  return (
    <Button
      variant="contained"
      color={buttonColor === 'primary' ? 'primary' : 'secondary'}
      sx={{ width: '100%' }}
    >
      <Typography variant="body2" sx={{ padding: 0, fontSize: '0.9vw' }}>
        {buttonText}
      </Typography>
    </Button>
  );
};
export default AboutMapOverlay;
