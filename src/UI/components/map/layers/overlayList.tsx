import React from 'react';
//import Paper from '@mui/material/Paper';
import { useAppSelector } from '../../../state/hooks';
import { overlayPanel } from './overlayPanel';

const unpackOverlays = (map_layers:any) => {
  const overlayList:any = [];
  for (let layer = 0; layer < map_layers.length ; layer++)
    if (map_layers[layer].name == 'world'){
      for (let overlay = 0; overlay < map_layers[layer].overlays.length; overlay++){
        const unpackedOverlay = {...map_layers[layer].overlays[overlay], sourceLayer: map_layers[layer].name, sourceType: map_layers[layer].sourceType} 
        overlayList.push(unpackedOverlay);
      }
    }
    else{
      overlayList.push(map_layers[layer]);
    }
  return overlayList;
};



export const OverlayList = () => {
  const layers = useAppSelector(state => state.map.map_overlays);
  return (
          <div>
              { toDos.map(toDo => (
              <ToDo key ={toDo.id} toDo={toDo}/>
              ))} 
          </div>
  );
};
export default OverlayList;
