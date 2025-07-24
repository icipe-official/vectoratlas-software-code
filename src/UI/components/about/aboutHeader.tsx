import React, { useState, useEffect, ReactNode } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Fade,
  Link as MuiLink,
  TypographyProps,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { keyframes } from '@emotion/react';

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
`;

// Animated Typography
interface AnimatedTypographyProps extends TypographyProps {
  delay?: number;
  children: ReactNode;
}

const AnimatedTypography: React.FC<AnimatedTypographyProps> = ({
  delay = 0,
  children,
  sx,
  ...props
}) => (
  <Typography
    {...props}
    sx={{
      animation: `${fadeInUp} 0.6s ease ${delay}s both`,
      ...sx,
    }}
  >
    {children}
  </Typography>
);

// Scroll Arrow
function ScrollArrow() {
  const [showScrollUp, setShowScrollUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollUp(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: showScrollUp ? 0 : window.innerHeight,
      behavior: 'smooth',
    });
  };

  if (typeof window !== 'undefined' && !showScrollUp && window.scrollY === 0) return null;

  return (
    <IconButton
      onClick={handleClick}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        backgroundColor: 'primary.main',
        color: 'white',
        zIndex: 999,
        animation: `${bounce} 2s infinite`,
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
      }}
    >
      {showScrollUp ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </IconButton>
  );
}

// Main Component
export default function AboutHeader() {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded((prev) => !prev);

  return (
    <Box
      sx={{
        px: 2,
        py: 2,
        maxWidth: 800,
        mx: 'auto',
        color: 'text.primary',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <AnimatedTypography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }} delay={0}>
        Empowering Vector Control with Data-Driven Maps
      </AnimatedTypography>

      {/* Intro Paragraph */}
      <AnimatedTypography variant="body1" sx={{ mb: 2 }} delay={0.1}>
        Maps are a powerful tool. They visualize where mosquito vector species—responsible for
        transmitting some of the world’s most devastating diseases—are found, and where these
        species may no longer respond to insecticides.
      </AnimatedTypography>

      {/* Toggleable Content */}
      <Collapse in={expanded} timeout={700}>
        <Fade in={expanded} timeout={700}>
          <Box>
            {[
              {
                text: `Every reliable map is built from field data. These data are often gathered by diverse teams
                using different methods, usually with narrow goals in mind. But when these fragmented
                datasets are brought together, their value increases exponentially.`,
                delay: 0.2,
              },
              {
                text: `The Vector Atlas is creating a centralized data hub linking vector occurrence,
                insecticide resistance, and bionomics data across Africa. Using standardized and robust
                collation protocols (Hay et al., 2010), we extract and harmonize data from both published
                and grey literature, while fully maintaining data ownership.`,
                delay: 0.3,
              },
              {
                text: `We’re updating our core datasets (Sinka et al., 2010; Massey et al., 2016; Moyes et al.,
                2020), expanding them to include not just dominant but also secondary vector species that
                contribute to residual malaria transmission.`,
                delay: 0.4,
              },
              {
                text: `Additional layers include localized human behavior, surrounding flora such as nectar
                sources, and fauna such as livestock—enriching our data for more insightful spatial models.`,
                delay: 0.5,
              },
              {
                text: `This three-year development phase will culminate in an open-access platform where users
                can upload and download data, view spatial models and risk maps, and interact with tools
                tailored for national vector control programs.`,
                delay: 0.6,
              },
              {
                text: `The Vector Atlas is a collaboration between the University of Oxford, icipe, and the
                Malaria Atlas Project. It's funded by the Bill & Melinda Gates Foundation and works with
                partners including GBIF, IR Mapper, PAMCA, VectorBase, Global Vector Hub, Amplicon
                Project, MalariaGen, and Target Malaria.`,
                delay: 0.7,
              },
              {
                text: `📣 We’re gathering feedback from those producing and using vector data.
                👉`,
                delay: 0.8,
                extra: (
                  <>
                    {' '}
                    <MuiLink
                      href="https://forms.gle/yQeZezGfhdTZXUm4A"
                      target="_blank"
                      underline="hover"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                          color: 'primary.dark',
                        },
                      }}
                    >
                      Fill out our quick survey
                    </MuiLink>{' '}
                    or email us at{' '}
                    <MuiLink
                      href="mailto:vectoratlas@icipe.org"
                      underline="hover"
                      sx={{
                        color: 'secondary.main',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                          color: 'secondary.dark',
                        },
                      }}
                    >
                      vectoratlas@icipe.org
                    </MuiLink>
                  </>
                ),
              },
            ].map(({ text, delay, extra }, index) => (
              <AnimatedTypography
                key={index}
                variant="body1"
                sx={{ mb: 2 }}
                delay={delay}
              >
                {text} {extra}
              </AnimatedTypography>
            ))}
          </Box>
        </Fade>
      </Collapse>

      {/* Read More Button */}
      <Box textAlign="center" mt={3}>
        <IconButton
          onClick={handleToggle}
          sx={{
            color: 'primary.main',
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            px: 2,
            py: 1,
            fontSize: '0.875rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {expanded ? (
            <>
              Show Less <ExpandLessIcon fontSize="small" sx={{ ml: 0.5 }} />
            </>
          ) : (
            <>
              Read More <ExpandMoreIcon fontSize="small" sx={{ ml: 0.5 }} />
            </>
          )}
        </IconButton>
      </Box>

      <ScrollArrow />
    </Box>
  );
}
