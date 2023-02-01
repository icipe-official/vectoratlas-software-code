import {
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    Grid,
    Box,
  } from '@mui/material';
  import ErrorIcon from '@mui/icons-material/Error';
  import CheckCircleIcon from '@mui/icons-material/CheckCircle';
  import { useAppSelector } from '../../../state/hooks';
import ValidationItem from './validationItem';

  export default function ValdidationConsole() {
    const validationItems: String[] = useAppSelector((s) => s.upload.validationErrors);
    const isError = validationItems.length > 0;

    return (
      <Grid sx={{marginTop: '30px'}}>
        <Box display={'flex'} flexDirection={'row'} sx={{alignItems: 'center'}}
        >
          <Typography variant='h6' color='primary.main'>Validation</Typography>
          {isError ? 
          <ErrorIcon  sx={{color:'red', marginLeft:1}}/> :
          <CheckCircleIcon  sx={{color:'green', marginLeft:1}}/>
          }
        </Box>
        <Box>
          <Grid container direction="column" sx={{ borderRadius:'5px', padding: 2}}>
            {validationItems.map((vi, i) => <ValidationItem key={i} item={vi}/>)}
            
          </Grid>
        </Box>
      </Grid>
    );
  }
  