import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import List from '@mui/material/List';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import { setSelectedIds, updateSelectedData } from '../../../state/map/mapSlice';
import DetailedData from './detailedData';
import { Button } from '@mui/material';
import EditModal from './EditModal';
import { updatePointData } from '../../../api/api';
import Swal from 'sweetalert2';
import store from '../../../state/store';

// --- Inline type declaration ---
interface Sample {
  occurrence_n_tot: number;
  sampling_occurrence_1: string;
}

interface RecordedSpecies {
  species: string;
}

interface Reference {
  author: string;
  citation: string;
  year: number;
}


export default function DataDrawer(): JSX.Element {
  const theme = useTheme();
  const dispatch = useDispatch();
  const drawerWidth = 370;
  const isEditor = useAppSelector((state) =>
    state.auth.roles.includes('editor')
  );  

  const data = useAppSelector((state) => state.map.selectedData);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState('');

  const handleDrawer = () => {
    dispatch(setSelectedIds([]));
  };

  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleUpdate = async (updatedData: any) => {
    console.log('Updated data:', updatedData);
    // TODO: Add Redux dispatch or API call to persist
      const result = await updatePointData(updatedData);
      try {
    const result = await updatePointData(updatedData);

    if (result?.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Update Successful',
        text: 'The occurrence was successfully updated.',
      });

      if (updatedData.id) {
      //dispatch(updateSelectedData([result.occurrence]));

      // 🔁 Update only the modified record in the list
      const updatedList = data.map((item) =>
        item.id === result.occurrence.id ? result.occurrence : item
      );

      dispatch(updateSelectedData(updatedList));
      }
-
      // Optionally close the modal
      setOpenModal(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong while updating the occurrence.',
      });
    }
  } catch (error) {
    console.error('Update error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while updating. Please try again.',
    });
  }
  };

  const openedMixin = {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    margin: '0px',
    height: 'calc(100vh - 230px)',
  };

  const drawerHeaderSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    ...theme.mixins.toolbar,
  };

  const drawerSx = {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...openedMixin,
    '& .MuiDrawer-paper': openedMixin,
  };

  return (
    <>
      <Drawer
        sx={drawerSx}
        PaperProps={{ sx: { position: 'inherit' } }}
        variant="permanent"
        open
        data-testid="drawer"
      >
        <Box sx={drawerHeaderSx}>
          <IconButton data-testid="drawerToggle" onClick={handleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {data.map((singleRow) => (
            <React.Fragment key={singleRow.id}>
              <Divider />
              <DetailedData data={singleRow} />
              {isEditor && (
              <Button style={{backgroundColor: "green", color: "white"}} onClick={() => handleEdit(singleRow)}>Edit</Button>
              )}
            </React.Fragment>
          ))}
          <Divider />
        </List>
      </Drawer>

      <EditModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        rowData={selectedRow}
        onUpdate={handleUpdate}
      />
    </>
  );
}
