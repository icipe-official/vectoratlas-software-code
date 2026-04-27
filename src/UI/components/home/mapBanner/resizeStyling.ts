export const overlayDivAbsoluteMobile = {
  position: 'relative',
  display: 'flex',
  left: 0,
  bottom: '0.5vw',
  padding: 5,
  borderRadius: '5px',
} as React.CSSProperties;

export const overlayDivAbsoluteBrowser = {
  position: 'absolute',
  display: 'flex',
  right: 0,
  bottom: '0.5vw',
  padding: 15,
  borderRadius: '5px',
} as React.CSSProperties;

export const overlayContainerMobile = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginLeft: '8px',
  marginRight: '8px',
} as React.CSSProperties;

export const overlayContainerBrowser = {
  ...overlayContainerMobile,
  alignItems: 'end',
} as React.CSSProperties;

export const vectorAtlasLogoMobile = {
  display: 'flex',
  width: '30vw',
  padding: 5,
  borderRadius: '5px',
} as React.CSSProperties;

export const vectorAtlasLogoBrowser = {
  width: '30vw',
} as React.CSSProperties;

export const divTypoContainerMobile = {
  width: '60%',
  borderRadius: '5px',
} as React.CSSProperties;

export const divTypoContainerBrowser = {
  width: '70%',
  padding: '5px',
  paddingRight: 0,
  marginTop: '5px',
  borderRadius: '5px',
} as React.CSSProperties;

export const typoDescMobile = {
  textAlign: 'center',
  borderRadius: '5px',
  fontSize: '3.5vw', // Use small viewport units
  width: '85%', // Leave room on the sides
  margin: '8px auto', // Center it with small vertical margins
  padding: '6px',
  background: 'rgba(157, 229, 253, 0.8)', // Semi-transparent to see map
} as React.CSSProperties;

export const typoDescBrowser = {
  textAlign: 'right',
  background: 'rgba(150, 180, 190, 0.9)',
  borderRadius: '5px',
  fontSize: '1.5vw',
  paddingLeft: 1,
} as React.CSSProperties;

export const exploreDataButtonMobile = {
  display: 'flex',
  width: '60vw',
  marginTop: '0 auto',
  alignItems: 'center',
  background: 'black',
  marginRight: 'auto',
  marginLeft: 0,
} as React.CSSProperties;

export const exploreDataButtonBrowser = {
  display: 'flex',
  width: '22vw',
  alignItems: 'center',
  background: 'black',
  marginTop: '5px',
  marginLeft: 'auto',
  marginRight: 0,
} as React.CSSProperties;
