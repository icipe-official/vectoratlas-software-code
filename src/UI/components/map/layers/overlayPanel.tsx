import React from 'react';

import Checkbox from '@mui/material/Checkbox';
// import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LayersIcon from '@mui/icons-material/Layers';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const OverlayPanel= ({name, sourceLayer, sourceType }:{name:string, sourceLayer:string, sourceType:string}) => {
  return (
    
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        style={{'height':14}}
      >
        <Checkbox defaultChecked onClick={e => e.stopPropagation()}/>
        <Typography style={{'display':'flex','alignItems':'center','fontSize':14}}>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography style={{'color':'gray', 'fontSize':12}}>
          Source Layer: {sourceLayer}
        </Typography>
        <Typography style={{'color':'gray', 'fontSize':12}}>
          Layer Type: {sourceType}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};
export {OverlayPanel};
