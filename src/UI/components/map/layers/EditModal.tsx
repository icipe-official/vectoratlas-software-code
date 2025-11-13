import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';

interface EditModalProps {
  open: boolean;
  handleClose: () => void;
  rowData: any | null;
  onUpdate: (updated: any) => void;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const EditModal: React.FC<EditModalProps> = ({
  open,
  handleClose,
  rowData,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<any | null>(rowData);

  useEffect(() => {
    setFormData(rowData);
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;

    const { name, value } = e.target;

    const parsedValue = [
      'year_start',
      'month_start',
      'reference.year',
      'sample.occurrence_n_tot',
    ].includes(name)
      ? parseInt(value)
      : value;

    const [mainKey, subKey] = name.split('.');

    if (subKey) {
      setFormData((prev: any) => ({
        ...prev,
        [mainKey]: {
          ...prev[mainKey],
          [subKey]: parsedValue,
        },
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
  };

  const handleSave = () => {
    if (formData) {
      onUpdate(formData);
      handleClose();
    }
  };

  if (!formData) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Edit Data
        </Typography>

        {/* Flat fields */}
        <TextField
          label="Year Start"
          name="year_start"
          type="number"
          value={formData.year_start}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Month Start"
          name="month_start"
          type="number"
          value={formData.month_start}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          select
          label="Binary Presence"
          name="binary_presence"
          value={formData.binary_presence}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="True">True</MenuItem>
          <MenuItem value="False">False</MenuItem>
        </TextField>

        <TextField
          label="Bionomics"
          name="bionomics"
          value={formData.bionomics || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Nested: sample */}
        <Typography variant="subtitle1" mt={2}>
          Sample Data
        </Typography>
        <TextField
          label="Occurrence N Tot"
          name="sample.occurrence_n_tot"
          type="number"
          value={formData.sample?.occurrence_n_tot ?? ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Sampling Occurrence 1"
          name="sample.sampling_occurrence_1"
          value={formData.sample?.sampling_occurrence_1 ?? ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Nested: recorded_species */}
        <Typography variant="subtitle1" mt={2}>
          Recorded Species
        </Typography>
        <TextField
          label="Species"
          name="recorded_species.species"
          value={formData.recorded_species?.species ?? ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Nested: reference */}
        <Typography variant="subtitle1" mt={2}>
          Reference
        </Typography>
        <TextField
          label="Author"
          name="reference.author"
          value={formData.reference?.author ?? ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Citation"
          name="reference.citation"
          value={formData.reference?.citation ?? ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Year"
          name="reference.year"
          type="number"
          value={formData.reference?.year ?? ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button variant="contained" onClick={handleSave} sx={{ mt: 3 }}>
          Update
        </Button>
      </Box>
    </Modal>
  );
};

export default EditModal;
