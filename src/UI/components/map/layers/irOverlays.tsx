// import React from 'react';
// import { useDispatch } from 'react-redux';
// import { useAppSelector } from '../../../state/hooks';
// import {
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Box,
// } from '@mui/material';
// import BugReportIcon from '@mui/icons-material/BugReport';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import { TreeView, TreeItem } from '@mui/x-tree-view';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { drawerListToggle, drawerToggle } from '../../../state/map/mapSlice';

// export default function IROverlayTree() {
//   const dispatch = useDispatch();

//   const drawerOpen = useAppSelector((state) => state.map.map_drawer.open);

//   const openIR = useAppSelector((state) => state.map.map_drawer.irOverlays);

//   const irOverlays = useAppSelector((state) =>
//     state.map.map_overlays.filter((l: any) => l.category === 'ir')
//   );

//   const overlaysByDecade = {
//     "90's": irOverlays.filter((o: any) => o.decade === '90s'),
//     "00's": irOverlays.filter((o: any) => o.decade === '00s'),
//     "10's": irOverlays.filter((o: any) => o.decade === '10s'),
//   };

//   const handleClick = () => {
//     if (drawerOpen) {
//       dispatch(drawerListToggle('irOverlays'));
//     } else {
//       dispatch(drawerToggle());
//       dispatch(drawerListToggle('irOverlays'));
//     }
//   };

//   return (
//     <ListItem disablePadding sx={{ display: 'block' }}>
//       {/* Header row */}
//       <ListItemButton
//         onClick={handleClick}
//         sx={{
//           minHeight: 48,
//           justifyContent: drawerOpen ? 'initial' : 'center',
//           px: 2.5,
//         }}
//       >
//         <ListItemIcon
//           sx={{
//             minWidth: 0,
//             mr: drawerOpen ? 3 : 'auto',
//             justifyContent: 'center',
//           }}
//         >
//           <BugReportIcon />
//         </ListItemIcon>

//         <ListItemText
//           primary="IR overlays"
//           sx={{ opacity: drawerOpen ? 1 : 0 }}
//         />

//         {drawerOpen && (openIR ? <ExpandLess /> : <ExpandMore />)}
//       </ListItemButton>

//       {/* Collapsible tree */}
//       <Collapse in={openIR} timeout="auto" unmountOnExit>
//         <Box sx={{ pl: 4, py: 1 }}>
//           <TreeView
//             defaultCollapseIcon={<ExpandMoreIcon />}
//             defaultExpandIcon={<ChevronRightIcon />}
//           >
//             {Object.entries(overlaysByDecade).map(([decade, overlays]) => (
//               <TreeItem key={decade} nodeId={decade} label={decade}>
//                 {overlays.map((overlay: any) => (
//                   <TreeItem
//                     key={overlay.id}
//                     nodeId={overlay.id}
//                     label={overlay.displayName ?? overlay.title}
//                   />
//                 ))}
//               </TreeItem>
//             ))}
//           </TreeView>
//         </Box>
//       </Collapse>
//     </ListItem>
//   );
// }
