import React from 'react';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PaletteIcon from '@mui/icons-material/Palette';

const ListButton= ({name, sourceType }:{name:string, sourceType:string}) => {
  const [layerConfig, setLayerConfig] = React.useState(false);

  // // Opacity Control Functionality:  
  // const opacityInput:any = document.getElementById('opacity-input');
  // const opacityOutput:any = document.getElementById('opacity-output');
  // function update() {
  //   const opacity = parseFloat(opacityInput.value);
  //   an_gambiae.setOpacity(opacity);
  //   opacityOutput.innerText = opacity.toFixed(2);
  // }
  // opacityInput.addEventListener('input', update);
  // update();

  return (
    <>
      <ListItemButton onClick ={() => {setLayerConfig(!layerConfig);}} sx={{ pl: 2 }}>
        <Checkbox defaultChecked onClick={e => e.stopPropagation()} style={{width:10, height:10}}/>
        <ListItemText primary={name} primaryTypographyProps={{fontSize: 12}}  sx={{color:'GrayText'}}/>
      </ListItemButton>
      {layerConfig ? <Paper variant="outlined" sx={{p:1, display:'flex',flexDirection:'column', justifyContent:'space-around', alignItems:'center', borderColor:'primary.main', color:'GrayText', fontSize:12}}>
        <div>
        Source type: {sourceType}
          <IconButton>
            <PaletteIcon/>
          </IconButton>
        </div>
        <div style={{'display':'flex', 'justifyContent':'space-around'}}>
          <label data-testid='opacityScroll'>
            Layer opacity &nbsp;
            <input id='opacity-input'  className='slider' type='range' min='0' max='1' step='0.01' data-testid='opacity-input'/>
            <span id='opacity-output'  className='sliderDial' data-testid='opacity-output'></span>
          </label>
        </div>
      </Paper> : <></>}
    </>
    
  );
};
export {ListButton};
