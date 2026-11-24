import React, { useMemo, useState } from 'react';
import { Box, Collapse, IconButton, Link, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Organization } from '../../../api/organizationApi';

type MapAttributionProps = {
  organizations: Organization[];
  visibleOrganizationIds: string[];
  bottomOffset?: number;
};

// Only http(s) links are rendered, so an admin-entered value such as
// "javascript:..." can never become a clickable link.
const safeUrl = (value?: string | null): string | null => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : null;
  } catch {
    return null;
  }
};

const OrganizationMark: React.FC<{ organization: Organization }> = ({
  organization,
}) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const logo = safeUrl(organization.logo);
  const website = safeUrl(organization.website);

  const content =
    logo && !logoFailed ? (
      <img
        src={logo}
        alt={organization.name}
        title={organization.name}
        height={22}
        referrerPolicy="no-referrer"
        onError={() => setLogoFailed(true)}
        style={{ display: 'block', maxWidth: 110, objectFit: 'contain' }}
      />
    ) : (
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        {organization.name}
      </Typography>
    );

  if (!website) return content;

  return (
    <Link
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
      color="inherit"
    >
      {content}
    </Link>
  );
};

const MapAttribution: React.FC<MapAttributionProps> = ({
  organizations,
  visibleOrganizationIds,
  bottomOffset = 12,
}) => {
  const [expanded, setExpanded] = useState(false);

  const credited = useMemo(() => {
    const ids = new Set(visibleOrganizationIds);
    return organizations.filter((o) => ids.has(o.id));
  }, [organizations, visibleOrganizationIds]);

  if (credited.length === 0) return null;

  return (
    <Box
      role="region"
      aria-label="Data credits"
      sx={{
        position: 'absolute',
        right: 12,
        bottom: bottomOffset,
        zIndex: 3,
        maxWidth: { xs: 'calc(100% - 24px)', sm: 340 },
        bgcolor: 'rgba(255, 255, 255, 0.92)',
        color: 'text.primary',
        borderRadius: 1,
        boxShadow: 2,
        px: 1.25,
        py: 0.75,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Data from
        </Typography>
        {credited.map((organization) => (
          <OrganizationMark key={organization.id} organization={organization} />
        ))}
        <IconButton
          size="small"
          aria-label={
            expanded ? 'Hide data credit details' : 'Show data credit details'
          }
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
          sx={{ p: 0.25 }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      <Collapse in={expanded} unmountOnExit>
        <Box sx={{ mt: 1, maxHeight: 220, overflowY: 'auto' }}>
          {credited.map((organization) => (
            <Box key={organization.id} sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                sx={{ display: 'block', fontWeight: 600 }}
              >
                {organization.name}
              </Typography>
              {organization.acknowledgement && (
                <Typography
                  variant="caption"
                  sx={{ display: 'block', whiteSpace: 'pre-line' }}
                >
                  {organization.acknowledgement}
                </Typography>
              )}
              {organization.terms_and_conditions && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', whiteSpace: 'pre-line', mt: 0.5 }}
                >
                  {organization.terms_and_conditions}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default MapAttribution;
