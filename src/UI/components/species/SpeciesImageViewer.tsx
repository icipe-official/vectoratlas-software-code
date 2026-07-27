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
  downloadSpeciesImageById,
  resolveSpeciesImageUrl,
} from '../../utils/speciesImageUtils';
import { useTranslations } from 'next-intl';

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.5;

type SpeciesImageViewerProps = {
  // Controls what's DISPLAYED — always the small preview image
  previewRef?: string;

  // Controls what's DOWNLOADED, direct case: pass this when the caller
  // already has the full-size image ref/URL loaded (the edit page).
  downloadRef?: string;

  // Controls what's DOWNLOADED, fallback case: pass this when the
  // caller only has the species id (the list page). If both downloadRef
  // and speciesId are given, downloadRef wins.
  speciesId?: string;

  alt: string;
  speciesName?: string;
  thumbnailWidth?: number | string;
  showActions?: boolean;
};

export default function SpeciesImageViewer({
  previewRef,
  downloadRef,
  speciesId,
  alt,
  speciesName,
  thumbnailWidth = 300,
  showActions = true,
}: SpeciesImageViewerProps) {
  const t = useTranslations('SpeciesPage');

  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

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
    // Prefer the direct ref when we have it — it's a single request.
    // Otherwise fall back to the id-based lookup.
    if (downloadRef) {
      await downloadSpeciesImage(downloadRef, speciesName);
    } else if (speciesId) {
      await downloadSpeciesImageById(speciesId, speciesName);
    }
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
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'nowrap' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ZoomInIcon />}
              onClick={() => setOpen(true)}
              sx={{ minWidth: 0, whiteSpace: 'nowrap', px: 1 }}
            >
              {t('buttons.preview')}
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{ minWidth: 0, whiteSpace: 'nowrap', px: 1 }}
            >
              {t('buttons.download')}
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
            <Tooltip title={t('tooltips.zoomOut')}>
              <span>
                <IconButton onClick={zoomOut} disabled={scale <= MIN_SCALE}>
                  <ZoomOutIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('tooltips.zoomIn')}>
              <span>
                <IconButton onClick={zoomIn} disabled={scale >= MAX_SCALE}>
                  <ZoomInIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('tooltips.resetZoom')}>
              <IconButton onClick={resetView}>
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              aria-label={t('tooltips.closePreview')}
              onClick={handleClose}
            >
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
          <Button onClick={handleClose}>{t('buttons.close')}</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            {t('buttons.downloadFull')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
