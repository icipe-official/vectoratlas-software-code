// components/organizations/LogoThumb.tsx
import { Box, Typography } from '@mui/material';
import { brand, initials } from './organizationUi';

interface Props {
  src: string | null;
  name: string;
  width?: number;
  height?: number;
}

// objectFit: 'contain' shows the WHOLE logo (the old list cropped it).
export default function LogoThumb({
  src,
  name,
  width = 96,
  height = 56,
}: Props) {
  return (
    <Box
      sx={{
        width,
        height,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: src ? '#fff' : brand.greenTint,
        border: `1px solid ${brand.border}`,
        borderRadius: 1.5,
      }}
    >
      {src ? (
        <Box
          component="img"
          src={src}
          alt={`${name} logo`}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            p: 0.75,
          }}
        />
      ) : (
        <Typography
          sx={{ fontWeight: 600, color: brand.green, fontSize: height * 0.36 }}
        >
          {initials(name) || '–'}
        </Typography>
      )}
    </Box>
  );
}
