import { Grid, Avatar, Box } from '@mui/material';

export default function AboutContact({name, location, position, imageURL}:{name:string, location: string, position: string, imageURL: string}) {
  return (
    <Grid container item sx={{width:1/3, justifyContent:'center'}}>
      <Box sx={{display:'inline-flex',width:1,cursor:'pointer', padding:2, borderRadius:5, border:2,borderColor:'primary.main'}}>
        <Grid container sx={{width:1/2, justifyContent:'center', alignItems:'center'}}>
          <Avatar sx={{height:150, width:150}} alt={name} src={imageURL}/>
        </Grid>
        <Grid container sx={{display:'inline-flex',flexDirection:'column',width:1/2, justifyContent:'center'}}>
          <Box sx={{fontWeight:'bold', color:'primary.main'}}>{name}</Box>
          <Box sx={{fontWeight:'Medium',marginBottom:2}}>{location}</Box>
          <Box sx={{fontSize:'12px'}}>{position}</Box>
        </Grid>
      </Box>
    </Grid>
  );
}
