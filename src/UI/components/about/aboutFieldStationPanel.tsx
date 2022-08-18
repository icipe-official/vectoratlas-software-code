import { Grid, Typography, Box } from '@mui/material';

export default function AboutOfficePanel({id, name, tel, fax, physicalLoc}:{id:number, name:string, tel:string, fax:string, physicalLoc:string }) {
  return (
    <Grid data-testid={`fieldStationContainer_${id}`} container item sx={{width:1, justifyContent:'center'}}>
      <Box sx={{display:'inline-flex',flexDirection:'column', rowGap:'3px',width:1,cursor:'pointer', padding:2}}>
        <Typography sx={{fontSize:'14px', fontWeight:'bold'}}>{name}</Typography>
        <Typography sx={{fontSize:'14px'}}>Tel: {tel}</Typography>
        <Typography sx={{fontSize:'14px'}}>Fax: {fax}</Typography>
        <Box display="inline-flex" >
          <Typography sx={{fontSize:'14px'}}>Location:</Typography>
          <Box sx={{fontSize:'14px'}}  color="blue">
            <a data-testid={`fieldStationLocation_Link_${id}`} href={physicalLoc} target='_blank' rel="noreferrer" color="blue">
             &nbsp; See Location
            </a>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
