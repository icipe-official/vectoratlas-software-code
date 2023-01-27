export const overlayDivAbsoluteMobile = {
  position: 'absolute',
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
  alignItems: 'start',
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
  textAlign: 'left',
  borderRadius: '5px',
  fontSize: '1.5vw',
  marginTop: '5px',
  paddingLeft: 1,
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
  width: '30vw',
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
