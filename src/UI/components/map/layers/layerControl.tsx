import React, { useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { layerToggle, updateMapLayerColour } from '../../../state/map/mapSlice';
import { downloadModelOutput } from '../../../state/map/actions/downloadModelOutput';
import { SketchPicker, ColorResult } from 'react-color';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import LanguageIcon from '@mui/icons-material/Language';

export const LayerControl = ({
  name,
  displayName,
  isVisible,
  blobLocation,
  externalLink,
}: {
  name: string;
  displayName: string;
  isVisible: boolean;
  blobLocation?: string;
  externalLink?: string;
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

  const handleColourChange = (color: ColorResult) => {
    dispatch(
      updateMapLayerColour({
        name,
        color: [color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a],
      })
    );
  };

  const showDownloadButton = !!blobLocation;
  const showExternalLinkButton = !!externalLink;

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
        {showDownloadButton ? (
          <IconButton
            aria-label="download layer"
            onClick={() => dispatch(downloadModelOutput(name, blobLocation)())}
          >
            <DownloadIcon />
          </IconButton>
        ) : null}
        {showExternalLinkButton ? (
          <IconButton
            aria-label="link to external map"
            target="_blank"
            href={externalLink}
          >
            <LanguageIcon />
          </IconButton>
        ) : null}
        {/* Commented out the colour picker in case we want to go back to using them for the base maps
            Currently it's unclear how much flexibility we want so we'll demo this before making
            a decision. */}
        {/* {!showColorPicker ? (
          <IconButton
            aria-label="current color"
            sx={{
              width: '25px',
              height: '25px',
              background: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a})`,
            }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          ></IconButton>
        ) : (
          <IconButton
            aria-label="close picker"
            onClick={() => setShowColorPicker(false)}
          >
            <CloseIcon />
          </IconButton>
        )} */}
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
