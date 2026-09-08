import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';

// Helper functions kept local to the card
const isPrimitive = (val: unknown): val is string | number | boolean | null =>
  typeof val === 'string' ||
  typeof val === 'number' ||
  typeof val === 'boolean' ||
  val === null;

const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean';

interface OccurrenceCardProps {
  data: any;
  onChange: (e: any, index?: number) => void;
  speciesList: any[];
  referenceList: any[];
}

const OccurrenceCard: React.FC<OccurrenceCardProps> = ({
  data,
  onChange,
  speciesList,
  referenceList,
}) => {
  if (!data) return null;

  const renderField = (key: string, value: unknown, index?: number) => {
    if (key === 'id' || key === 'dec_id' || key === 'source_id') return null;

    // Custom Species Dropdown
    if (key === 'recordedSpecies' || key === 'recorded_species') {
      const currentId =
        typeof value === 'object' && value !== null ? (value as any).id : value;
      const currentSpecies =
        speciesList.find((s) => s.id === currentId) || null;

      return (
        <Autocomplete
          key={key}
          options={speciesList}
          getOptionLabel={(option) =>
            option.display_name || option.species || 'Unknown'
          }
          value={currentSpecies}
          onChange={(_, newValue) => {
            onChange(
              {
                target: {
                  name: key,
                  value: newValue
                    ? { id: newValue.id, display_name: newValue.display_name }
                    : null,
                },
              },
              index
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Recorded Species"
              margin="normal"
              fullWidth
              sx={{ bgcolor: 'white' }}
            />
          )}
        />
      );
    }

    // Custom Reference Dropdown
    if (key === 'reference') {
      const currentId =
        typeof value === 'object' && value !== null ? (value as any).id : value;

      const currentReference =
        referenceList?.find((r) => r.id === currentId) ||
        (typeof value === 'object' && value !== null ? value : null);

      return (
        <Autocomplete
          key={key}
          options={referenceList || []}
          getOptionLabel={(option) =>
            option.article_title ||
            option.citation ||
            `Unknown (ID: ${option.id})`
          }
          isOptionEqualToValue={(option, val) => option.id === val.id}
          value={currentReference}
          onChange={(_, newValue) => {
            onChange(
              {
                target: {
                  name: key,
                  value: newValue
                    ? {
                        id: newValue.id,
                        article_title: newValue.article_title,
                        citation: newValue.citation,
                      }
                    : null,
                },
              },
              index
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Reference"
              margin="normal"
              fullWidth
              sx={{ bgcolor: 'white' }}
            />
          )}
        />
      );
    }

    // Read Only Relations
    if (key === 'site' || key === 'dataset') {
      const linkId =
        typeof value === 'object' && value !== null
          ? (value as any).id
          : String(value || 'None');
      return (
        <TextField
          key={key}
          label={`${key.toUpperCase()} ID (Strict Relation)`}
          value={linkId}
          fullWidth
          margin="normal"
          disabled
          helperText="Relational mapping. Locked to prevent database constraint errors."
          sx={{ bgcolor: '#f5f5f5' }}
        />
      );
    }

    // Insecticide Resistance Data Type Dropdown
    if (key === 'insecticide_resistance_data') {
      return (
        <FormControl
          fullWidth
          margin="normal"
          key={key}
          sx={{ bgcolor: 'white' }}
        >
          <InputLabel id={`${key}-label`}>
            Insecticide Resistance Data Type
          </InputLabel>
          <Select
            labelId={`${key}-label`}
            name={key}
            value={value || ''}
            onChange={(e: any) => onChange(e, index)}
          >
            <MenuItem value="">
              <em>None / Unknown</em>
            </MenuItem>
            <MenuItem value="phenotypic">Phenotypic</MenuItem>
            <MenuItem value="genotypic">Genotypic</MenuItem>
          </Select>
        </FormControl>
      );
    }

    // Primitive Fields
    if (!isPrimitive(value)) return null;

    if (
      isBoolean(value) ||
      (typeof value === 'string' &&
        (value.toLowerCase() === 'true' || value.toLowerCase() === 'false'))
    ) {
      return (
        <FormControl
          fullWidth
          margin="normal"
          key={key}
          sx={{ bgcolor: 'white' }}
        >
          <InputLabel id={`${key}-label`}>{key}</InputLabel>
          <Select
            labelId={`${key}-label`}
            name={key}
            value={String(value).toLowerCase() === 'true' ? 'true' : 'false'}
            onChange={(e: any) => onChange(e, index)}
          >
            <MenuItem value="true">true</MenuItem>
            <MenuItem value="false">false</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        key={key}
        label={key}
        name={key}
        value={value ?? ''}
        fullWidth
        margin="normal"
        onChange={(e: any) => onChange(e, index)}
        sx={{ bgcolor: 'white' }}
      />
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      {Array.isArray(data) ? (
        data.map((record, index) => (
          <Box
            key={String(record.id) || index}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 3,
              mb: 3,
              bgcolor: '#fafafa',
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Occurrence Record {index + 1}
            </Typography>
            {Object.entries(record).map(([key, value]) =>
              renderField(key, value, index)
            )}
          </Box>
        ))
      ) : (
        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 3,
            mb: 3,
            bgcolor: '#fafafa',
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            Occurrence Record
          </Typography>
          {Object.entries(data).map(([key, value]) => renderField(key, value))}
        </Box>
      )}
    </Box>
  );
};

export default OccurrenceCard;
