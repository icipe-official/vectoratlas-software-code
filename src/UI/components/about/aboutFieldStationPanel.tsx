import { Grid, Typography, Box } from '@mui/material';

export default function AboutOfficePanel({name, tel, fax, physicalLoc}:{name:string, tel:string, fax:string, physicalLoc:string }) {
  return (
    <Grid container item sx={{width:1, justifyContent:'center'}}>
      <Box sx={{display:'inline-flex',flexDirection:'column', rowGap:'3px',width:1,cursor:'pointer', padding:2}}>
        <Typography sx={{fontSize:'14px', fontWeight:'bold'}}>{name}</Typography>
        <Typography sx={{fontSize:'14px'}}>Tel: {tel}</Typography>
        <Typography sx={{fontSize:'14px'}}>Fax: {fax}</Typography>
        <Typography sx={{fontSize:'14px'}}>Location:
          <Box display="inline-flex" color="blue">
            <a href={physicalLoc} target='_blank' rel="noreferrer" color="blue">
             &nbsp; See Location
            </a>
          </Box>
        </Typography>
      </Box>
    </Grid>
  );
}
