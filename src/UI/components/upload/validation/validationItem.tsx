import { ErrorRounded } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { ErrorRow } from '../../../state/upload/uploadSlice';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { none } from 'ol/rotationconstraint';

export default function Validationitem({
  validationRow,
}: {
  validationRow: ErrorRow;
}) {
  const requiredErrors = validationRow.data.filter((error:any)=> error.errorType === 'Required data');
  const typeErrors = validationRow.data.filter((error:any)=> error.errorType === 'Incorrect data type');

  const errorDropDown = {
    '&:hover': {
      backgroundColor: 'rgba(3,133,67,0.2)',
      cursor: 'pointer',
      height:'50%',
      marginLeft:1,
    },
  };

  const [requiredPanel, setRequiredPanel] = useState(false);
  const [typePanel, setTypePanel] = useState(false);

  return (
    <Grid sx={{marginTop:1, marginBottom:2}}>
      <Box>
        <Typography color='black' display={'flex'}>
          <Typography variant='button' color='red'>Error - &nbsp;</Typography> Row: {validationRow.row}
        </Typography>
      </Box>
      <Box sx={{marginLeft:2, marginTop:1}}>
        {requiredErrors.length > 0 ? 
        <>
          <div onClick={() => setRequiredPanel(!requiredPanel)}>
            <Typography color='black' sx={errorDropDown} display='flex'>
            {requiredPanel ? <ExpandMoreIcon/> : <ChevronRightIcon/>} Required field ({requiredErrors.length})
            </Typography>
          </div>
          { requiredPanel ? 
          <div style={{marginTop:5}}>
            {requiredErrors.map((error) => 
              <Typography variant='body2' style={{marginLeft:100}}> - {error.key} column is a required field of type {error.expectedType}</Typography>
            )}
          </div> : <></>
          }
        </> : <></>}
        
        {typeErrors.length > 0 ? 
        <>
          <div style={{marginTop:10}} onClick={() => setTypePanel(!typePanel)}>
            <Typography color='black' sx={errorDropDown} display='flex'>
              {typePanel ? <ExpandMoreIcon/> : <ChevronRightIcon/>} Incorrect data type ({typeErrors.length})
            </Typography>
          </div>
          { typePanel ? 
          <div style={{marginTop:5}}>
            {typeErrors.map((error) => 
              <Typography variant='body2' style={{marginLeft:100}}> - {error.key} column received {error.receivedType} when a {error.expectedType} is required</Typography>
            )}
          </div> : <></>
          }
        </> : <></>}
        
      </Box>
    </Grid>

  
  );
}
