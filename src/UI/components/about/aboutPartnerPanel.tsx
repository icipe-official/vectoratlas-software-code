import React from 'react';
import { Grid, Box } from '@mui/material';

export default function AboutPartnerPanel({id, name, homepage,imageURL}:{id:number,name:string, homepage:string, imageURL:string}) {
  return (
    <Grid data-testid={`partnerPanelContainer_${id}`} container item sx={{width:1/3, justifyContent:'center'}}>
      <a href={homepage} target='_blank' rel="noreferrer">
        <Box sx={ name==='PAMCA' ? {cursor:'pointer',backgroundColor:'black', padding:1} : {cursor:'pointer'} } >
          <img src={imageURL} height='70' alt={name} ></img>
        </Box>
      </a>
    </Grid>
  );
}
