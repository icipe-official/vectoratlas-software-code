import React, { useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { layerToggle, updateMapLayerColour } from '../../../state/map/mapSlice';
import { SketchPicker } from 'react-color';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export const LayerControl = ({
  name,
  displayName,
  isVisible,
}: {
  name: string;
  displayName: string;
  isVisible: boolean;
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const dispatch = useAppDispatch();
  const layerStyle = useAppSelector((state) =>
    state.map.map_styles.layers.find((l) => l.name === name)
  );

  const handleVisibilityChange = () => {
    dispatch(layerToggle(name));
  };

  const defaultColor = [0, 0, 0, 1];
  const layerColor = layerStyle
    ? layerStyle.colorChange === 'fill'
      ? layerStyle.fillColor
      : layerStyle.strokeColor
    : defaultColor;
  const currentColor = {
    r: layerColor[0],
    g: layerColor[1],
    b: layerColor[2],
    a: layerColor[3],
  };

  const handleColourChange = (color) => {
    dispatch(
      updateMapLayerColour({
        name,
        color: [color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a],
      })
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: 30 }}>
        <ListItemButton
          data-testid={`layerButton_${name}`}
          sx={{ pl: 2 }}
          onClick={handleVisibilityChange}
        >
          <Checkbox
            id={`${name}Checkbox`}
            data-testid={`${name}Checkbox`}
            checked={isVisible}
            style={{ width: 10, height: 10 }}
          />
          <ListItemText
            primary={displayName}
            primaryTypographyProps={{ fontSize: 12 }}
            sx={{ color: 'GrayText' }}
          />
        </ListItemButton>
        {!showColorPicker ? (
          <IconButton
            aria-label='current color'
            sx={{
              width: '25px',
              height: '25px',
              background: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a})`,
            }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          ></IconButton>
        ) : 
        <IconButton aria-label='close picker' onClick={() => setShowColorPicker(false)} >
          <CloseIcon />
        </IconButton>}
      </div>
      {showColorPicker ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <SketchPicker color={currentColor} onChange={handleColourChange} />
        </div>
      ) : null}
    </div>
  );
};
