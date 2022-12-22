import { Paper, Box, Button, Typography, Switch } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormControlLabel, TextField } from '@mui/material';
import React, { useState } from 'react';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { postNewSource } from '../../state/source/actions/postNewSource';

export interface NewSource {
  author: string;
  article_title: string;
  journal_title: string;
  citation: string;
  year: number;
  published: boolean;
  report_type: string;
  v_data: boolean;
  num_id: number;
}

const schema = yup
  .object()
  .shape({
    author: yup.string().required(),
    article_title: yup.string().required(),
    journal_title: yup.string().required(),
    year: yup.string().required(),
    published: yup.boolean().required(),
    report_type: yup.string().required(),
    v_data: yup.boolean().required(),
  })
  .required();

export default function SourceForm() {
  const { register, reset, control, handleSubmit } = useForm<NewSource>({
    resolver: yupResolver(schema),
    defaultValues: {
      v_data: false,
      published: false,
    },
  });
  const [year, setYear] = useState<Date | null>(null);
  const onKeyDown = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
 };

  const dispatch = useDispatch<AppDispatch>();
  const onSubmit = async (data: NewSource) => {
    console.log(data);
    const success = await dispatch(postNewSource(data));
    if (success) {
      reset();
    }
  };

  return (
    <Paper
      data-testid={'sourceform'}
      sx={{
        width: '100%',
        height: '100%',
        justifyContent: 'justify-between',
        alignItems: 'center',
      }}
    >
      <Box p="35px" sx={{ width: 1 }}>
        <form onSubmit={handleSubmit((d) => onSubmit(d))}>
          <div>
            <Typography variant="h4" color="primary" pb={1}>
              <strong>ADD A NEW REFERENCE SOURCE</strong>
            </Typography>
            <br />
          </div>
          <div>
            <Controller
              name="author"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value || ''}
                  label={'Author:'}
                  error={!!error}
                  helperText={error ? error.message : null}
                  {...register('author')}
                ></TextField>
              )}
              rules={{ required: 'Author required' }}
            />
          </div>

          <br />
          <div>
            <Controller
              name="article_title"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value || ''}
                  label={'Article Title:'}
                  error={!!error}
                  helperText={error ? error.message : null}
                  {...register('article_title')}
                ></TextField>
              )}
              rules={{ required: 'Article Title required' }}
            />
          </div>
          <br />

          <div>
            <Controller
              name="journal_title"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value || ''}
                  label={'Journal Title:'}
                  error={!!error}
                  helperText={error ? error.message : null}
                  {...register('journal_title')}
                ></TextField>
              )}
              rules={{ required: 'Journal Title required' }}
            />
          </div>
          <br />

          <div>
            <Controller
              name="citation"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value || ''}
                  label={'Citation:'}
                  error={!!error}
                  helperText={error ? error.message : null}
                  {...register('citation')}
                ></TextField>
              )}
              rules={{ required: 'Citation required' }}
            />
          </div>
          <br />

          <div>
            <Controller
              name="year"
              control={control}
              render={({
                field: { onChange, ...restField },
                fieldState: { error },
              }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    data-testid="year-pick"
                    views={['year']}
                    inputFormat="yyyy"
                    label="Year"
                    disableFuture
                    value={year}
                    onChange={(event) => {
                      onChange(event);
                      setYear(event);

                    }}
                    renderInput={(params) => (
                      <TextField
                        onKeyDown={onKeyDown}
                        size="small"
                        {...params}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  ></DatePicker>
                </LocalizationProvider>
              )}
              rules={{ required: 'Year required' }}
            />
          </div>
          <br />

          <div>
            <Controller
              name="report_type"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value || ''}
                  type="text"
                  label="Report Type:"
                  error={!!error}
                  helperText={error ? error.message : null}
                  variant="outlined"
                  {...register('report_type')}
                ></TextField>
              )}
              rules={{ required: 'Report Type required' }}
            />
          </div>
          <br />

          <div>
            <Controller
              name="published"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!value}
                      color="primary"
                      size="medium"
                      {...register('published')}
                    />
                  }
                  label="Published"
                  sx={{ '.MuiSwitch-switchBase': { margin: 0 } }}
                />
              )}
            />
          </div>

          <br />
          <div>
            <Controller
              name="v_data"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!value}
                      color="primary"
                      size="medium"
                      {...register('v_data')}
                    />
                  }
                  label="Vector data"
                  sx={{ '.MuiSwitch-switchBase': { margin: 0 } }}
                />
              )}
            />
          </div>
          <br />
          <Button data-testid={'sourcebutton'} type="submit" variant="outlined">
            Submit
          </Button>
          <Button
            onClick={() => {
              setYear(null);
              reset();
            }}
            variant={'outlined'}
          >
            Reset
          </Button>
        </form>
      </Box>
    </Paper>
  );
}
