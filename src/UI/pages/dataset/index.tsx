// import { AddIcon } from '@mui/icons-material/Add';
//import { Button}
import { Button, Container, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { Link } from '@mui/icons-material';
import { UploadedDatasetList } from '../../components/dataset/uploadedDatasetList';
 
const DatasetPage = (): JSX.Element => {
  return (
    <>
      <div>
        <main>
          <Container
            maxWidth={false}
            sx={{
              padding: '10px',
              maxWidth: '75%',
            }}
          >
          <UploadedDatasetList />
          </Container>
        </main>
      </div>
    </>
  );
};

export default DatasetPage;
