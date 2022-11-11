import { Paper, Box, Button, Typography, Switch } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormControlLabel, TextField } from '@mui/material';
import React from 'react';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { postNewSource } from '../../state/sourceSlice';
import { AppDispatch } from '../../state/store';

export interface NewSource {
  author: string;
  article_title: string;
  journal_title: string;
  year: number;
  published: boolean;
  report_type: string;
  v_data: boolean;
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
  });

  const dispatch = useDispatch<AppDispatch>();
  const onSubmit = (data: NewSource) => {
    dispatch(postNewSource(data));
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
              render={({ field: { onChange, value } }) => (
                <TextField
                  value={value || ''}
                  label={'Author:'}
                  {...register('author')}
                ></TextField>
              )}
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
              render={({ field: { onChange, value } }) => (
                <TextField
                  value={value || ''}
                  label={'Journal Title:'}
                  {...register('journal_title')}
                ></TextField>
              )}
            />
          </div>
          <br />

          <div>
            <Controller
              name="year"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  value={value || ''}
                  type="number"
                  label="Year:"
                  variant="outlined"
                  {...register('year')}
                ></TextField>
              )}
            />
          </div>
          <br />

          <div>
            <Controller
              name="report_type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  value={value || ''}
                  type="text"
                  label="Report type:"
                  variant="outlined"
                  {...register('report_type')}
                ></TextField>
              )}
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
                      color="primary"
                      size="medium"
                      {...register('published')}
                      defaultChecked
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
                      color="primary"
                      size="medium"
                      {...register('v_data')}
                      defaultChecked
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
          <Button onClick={() => reset()} variant={'outlined'}>
            Reset
          </Button>
        </form>
      </Box>
    </Paper>
  );
}
