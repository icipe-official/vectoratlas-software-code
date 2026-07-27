import { useState, useRef, WheelEvent, MouseEvent } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import {
  downloadSpeciesImage,
  resolveSpeciesImageUrl,
} from '../../utils/speciesImageUtils';

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.5;

type SpeciesImageViewerProps = {
  // CHANGED: split the old single `imageRef` into two props —
  // previewRef drives what's displayed, downloadRef drives what's downloaded
  previewRef?: string;
  downloadRef?: string;
  alt: string;
  speciesName?: string;
  thumbnailWidth?: number | string;
  showActions?: boolean;
};

export default function SpeciesImageViewer({
  previewRef,
  downloadRef,
  alt,
  speciesName,
  thumbnailWidth = 300,
  showActions = true,
}: SpeciesImageViewerProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // CHANGED: image shown on screen now resolves from previewRef (resized version)
  const imageUrl = resolveSpeciesImageUrl(previewRef);
  if (!imageUrl) {
    return null;
  }

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleClose = () => {
    resetView();
    setOpen(false);
  };

  const handleDownload = async () => {
    // CHANGED: download now uses downloadRef (original full-size speciesImage)
    // instead of the same ref used for preview
    await downloadSpeciesImage(downloadRef, speciesName);
  };

  const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP));
  const zoomOut = () =>
    setScale((s) => {
      const next = Math.max(MIN_SCALE, s - SCALE_STEP);
      if (next === MIN_SCALE) setPosition({ x: 0, y: 0 });
      return next;
    });

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    if (scale === 1) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPosition((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  return (
    <>
      <Box sx={{ width: thumbnailWidth }}>
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: 'auto',
            padding: 5,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {showActions && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ZoomInIcon />}
              onClick={() => setOpen(true)}
            >
              Preview
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
          }}
        >
          {speciesName || alt}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Zoom out">
              <span>
                <IconButton onClick={zoomOut} disabled={scale <= MIN_SCALE}>
                  <ZoomOutIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Zoom in">
              <span>
                <IconButton onClick={zoomIn} disabled={scale >= MAX_SCALE}>
                  <ZoomInIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Reset zoom">
              <IconButton onClick={resetView}>
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
            <IconButton aria-label="Close preview" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          onWheel={handleWheel}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'grey.100',
            p: 2,
            height: '75vh',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={alt}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            draggable={false}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging.current
                ? 'none'
                : 'transform 0.15s ease-out',
              cursor: scale > 1 ? 'grab' : 'default',
              userSelect: 'none',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download full image
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
