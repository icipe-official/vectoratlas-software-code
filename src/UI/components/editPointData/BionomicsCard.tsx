import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface BionomicsCardProps {
  data: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => void;
}

const BionomicsCard: React.FC<BionomicsCardProps> = ({ data, onChange }) => {
  if (!data) return null;

  if (Object.keys(data).length === 0) {
    return (
      <Box
        sx={{
          p: 4,
          mt: 3,
          border: '2px dashed #e0e0e0',
          borderRadius: 2,
          textAlign: 'center',
          bgcolor: '#fafafa',
        }}
      >
        <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500 }}>
          There is no bionomics data available for the following occurrence.
        </Typography>
      </Box>
    );
  }

  // Helper for standard text and number fields
  const renderField = (key: string, label: string, type: string = 'text') => (
    <Grid item xs={12} sm={6} md={4} key={key}>
      <TextField
        fullWidth
        label={label}
        name={key}
        type={type}
        value={data[key] ?? ''}
        onChange={onChange}
        margin="normal"
        variant="outlined"
        sx={{ bgcolor: 'white' }}
      />
    </Grid>
  );

 
  const renderBoolean = (
    key: string,
    label: string,
    disabled: boolean = false
  ) => (
    <Grid item xs={12} sm={6} md={4} key={key}>
      <FormControl
        fullWidth
        margin="normal"
        disabled={disabled}
        sx={{ bgcolor: disabled ? '#f5f5f5' : 'white' }}
      >
        <InputLabel id={`${key}-label`}>{label}</InputLabel>
        <Select
          labelId={`${key}-label`}
          name={key}
          value={
            data[key] !== undefined && data[key] !== null
              ? String(data[key])
              : ''
          }
          onChange={onChange as any}
          label={label}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* SECTION 1: Sampling & Study Design */}
      <Typography
        variant="h6"
        sx={{ mt: 2, mb: 1, color: '#555', fontWeight: 600 }}
      >
        Sampling & Study Design
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {/* Locked down fields passed with 'true' */}
        {renderBoolean('adult_data', 'Adult Data Collected?', true)}
        {renderBoolean('larval_site_data', 'Larval Site Data Collected?', true)}
        {renderField('study_sampling_design', 'Study Sampling Design')}
        {renderBoolean('contact_authors', 'Authors Contacted?', true)}
        {renderField('contact_notes', 'Contact Notes')}
        {renderField('secondary_info', 'Secondary Info')}
      </Grid>

      {/* SECTION 2: Time & Seasonality */}
      <Typography
        variant="h6"
        sx={{ mt: 4, mb: 1, color: '#555', fontWeight: 600 }}
      >
        Time & Seasonality
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {renderField('month_start', 'Month Start', 'number')}
        {renderField('year_start', 'Year Start', 'number')}
        {renderField('month_end', 'Month End', 'number')}
        {renderField('year_end', 'Year End', 'number')}
        {renderField('season_given', 'Season (Given)')}
        {renderField('season_calc', 'Season (Calculated)')}
        {renderField('rainfall_time', 'Rainfall Time')}
        {renderField('season_notes', 'Season Notes')}
      </Grid>

      {/* SECTION 3: Interventions & Control */}
      <Typography
        variant="h6"
        sx={{ mt: 4, mb: 1, color: '#555', fontWeight: 600 }}
      >
        Interventions & Control
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {renderBoolean('insecticide_control', 'Insecticide Control Used?')}
        {renderBoolean('itn_use', 'ITN Use?', true)} 
        {renderField('control', 'Control Details')}
        
        <Grid item xs={12} sm={6} md={4}>
          <FormControl
            fullWidth
            margin="normal"
            disabled={true}
            sx={{ bgcolor: '#f5f5f5' }}
          >
            <InputLabel id="ir-data-type-label">
              Insecticide Resistance Data Type
            </InputLabel>
            <Select
              labelId="ir-data-type-label"
              name="insecticide_resistance_data"
              value={data.insecticide_resistance_data || ''}
              onChange={onChange as any}
              label="Insecticide Resistance Data Type"
            >
              <MenuItem value="">
                <em>None / Unknown</em>
              </MenuItem>
              <MenuItem value="phenotypic">Phenotypic</MenuItem>
              <MenuItem value="genotypic">Genotypic</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          label="Control Notes"
          name="control_notes"
          value={data.control_notes ?? ''}
          onChange={onChange}
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
      </Box>

      {/* SECTION 4: Data Curation */}
      <Typography
        variant="h6"
        sx={{ mt: 4, mb: 1, color: '#555', fontWeight: 600 }}
      >
        Data Curation (Admin)
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {renderField('data_abstracted_by', 'Abstracted By')}
        {renderField('data_checked_by', 'Checked By')}
        {renderField('final_check_by', 'Final Check By')}
      </Grid>
    </Box>
  );
};

export default BionomicsCard;
