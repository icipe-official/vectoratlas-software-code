import React from 'react';
import { Box, Typography, TextField, Grid, Divider } from '@mui/material';

interface IRCardProps {
  data: any;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const InsecticideResistanceCard: React.FC<IRCardProps> = ({
  data,
  onChange,
}) => {
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
          There is no insecticide resistance data available for the following
          occurrence.
        </Typography>
      </Box>
    );
  }

  // Helper to render standard text/number fields 
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

  return (
    <Box sx={{ p: 2 }}>
      {/* SECTION 1: Test Details & Protocol */}
      <Typography
        variant="h6"
        sx={{ mt: 2, mb: 1, color: '#555', fontWeight: 600 }}
      >
        Test Details & Protocol
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {renderField('test_protocol', 'Test Protocol')}
        {renderField('insecticide_tested', 'Insecticide Tested')}
        {renderField('insecticide_class', 'Insecticide Class')}
        {renderField('concentration_percent', 'Concentration (%)', 'number')}
        {renderField('exposure_period_min', 'Exposure Period (min)', 'number')}
        {renderField('generation', 'Mosquito Generation')}
        {renderField('wild_caught_larvae_or_adults', 'Wild Caught State')}
        {renderField('lower_age_days', 'Lower Age (Days)', 'number')}
        {renderField('upper_age_days', 'Upper Age (Days)', 'number')}
      </Grid>

      {/* SECTION 2: Mortality & Knockdown Metrics */}
      <Typography
        variant="h6"
        sx={{ mt: 4, mb: 1, color: '#555', fontWeight: 600 }}
      >
        Mortality & Knockdown Results
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {renderField('mosquitoes_tested_n', 'Mosquitoes Tested (n)', 'number')}
        {renderField('mosquitoes_dead_n', 'Mosquitoes Dead (n)', 'number')}
        {renderField('percent_mortality', 'Mortality (%)', 'number')}
        {renderField(
          'knock_down_exposure_time_min',
          'Knockdown Exposure (min)',
          'number'
        )}
        {renderField('mosquitoes_knocked_down_n', 'Knocked Down (n)', 'number')}
        {renderField('knock_down_percent', 'Knockdown (%)', 'number')}
        {renderField('kdt_50_percent_min', 'KDT 50% (min)', 'number')}
        {renderField('kdt_90_percent_min', 'KDT 90% (min)', 'number')}
        {renderField('kdt_95_percent_min', 'KDT 95% (min)', 'number')}
      </Grid>

      {/* SECTION 3: Synergist Data */}
      <Typography
        variant="h6"
        sx={{ mt: 4, mb: 1, color: '#555', fontWeight: 600 }}
      >
        Synergist Data
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {renderField('synergist_tested', 'Synergist Tested')}
        {renderField(
          'synergist_concentration',
          'Synergist Concentration',
          'number'
        )}
        {renderField('synergist_concentration_unit', 'Concentration Unit')}
      </Grid>

      {/* SECTION 4: Notes */}
      <Typography
        variant="h6"
        sx={{ mt: 4, mb: 1, color: '#555', fontWeight: 600 }}
      >
        Additional Information
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Bioassay Notes"
          name="bioassay_notes"
          value={data.bioassay_notes ?? ''}
          onChange={onChange}
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
      </Box>
    </Box>
  );
};

export default InsecticideResistanceCard;
