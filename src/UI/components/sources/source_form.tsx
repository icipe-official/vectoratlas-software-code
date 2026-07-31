import { Paper, Box, Button, Typography, Switch } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormControlLabel, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { postNewSource } from '../../state/source/actions/postNewSource';
import { updateSource } from '../../state/source/actions/updateSource';
import { useTranslations } from 'next-intl';
import { TextEditor } from '../shared/textEditor/RichTextEditor';

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
    report_type: yup.string().notRequired(),
    v_data: yup.boolean().required(),
    num_id: yup.number().notRequired(),
  })
  .required();

interface SourceFormProps {
  existingSource?: NewSource | null;
}

const DEFAULT_REPORT_TYPE = 'Journal Article';

export default function SourceForm({ existingSource }: SourceFormProps) {
  const t = useTranslations('NewSourcePage');
  const isEditMode = !!existingSource;

  const { reset, control, handleSubmit } = useForm<NewSource>({
    resolver: yupResolver(schema),
    defaultValues: {
      v_data: false,
      published: false,
      report_type: DEFAULT_REPORT_TYPE,
    },
  });
  const [year, setYear] = useState<Date | null>(null);
  const onKeyDown = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (existingSource) {
      reset(existingSource);
      setYear(new Date(existingSource.year, 0, 1));
    }
  }, [existingSource, reset]);

  const onSubmit = async (data: NewSource) => {
    if (isEditMode) {
      // updateSource already shows a success/error toast internally
      await dispatch(updateSource(data));
    } else {
      const resultAction = await dispatch(postNewSource(data));
      // postNewSource already shows a success/error toast internally;
      // we just check the real return value to decide whether to clear the form
      if (
        postNewSource.fulfilled.match(resultAction) &&
        resultAction.payload === true
      ) {
        reset({
          v_data: false,
          published: false,
          report_type: DEFAULT_REPORT_TYPE,
        });
        setYear(null);
      }
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
              <strong>{isEditMode ? t('editTitle') : t('title')}</strong>
            </Typography>
            <br />
          </div>

          <div>
            <Controller
              name="author"
              control={control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextEditor
                  label={t('author')}
                  description={value || ''}
                  initialDescription={value || ''}
                  setDescription={onChange}
                  error={!!error}
                  helperText={error ? t('authorHelperText') : undefined}
                  hideBlockTypeSelector
                />
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
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextEditor
                  label={t('articleTitle')}
                  description={value || ''}
                  initialDescription={value || ''}
                  setDescription={onChange}
                  error={!!error}
                  helperText={error ? t('articleTitleHelperText') : undefined}
                  hideBlockTypeSelector
                />
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
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextEditor
                  label={t('journalTitle')}
                  description={value || ''}
                  initialDescription={value || ''}
                  setDescription={onChange}
                  error={!!error}
                  helperText={error ? t('journalTitleHelperText') : undefined}
                  hideBlockTypeSelector
                />
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
                  onChange={onChange}
                  label={t('citation')}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
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
                    label={t('year')}
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
                        helperText={
                          error ? (error.message = t('yearHelperText')) : null
                        }
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
                  onChange={onChange}
                  type="text"
                  label={t('reportType')}
                  error={!!error}
                  helperText={
                    error ? (error.message = t('reportTypeHelperText')) : null
                  }
                  variant="outlined"
                />
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
                      checked={!!value}
                      onChange={(e) => onChange(e.target.checked)}
                      color="primary"
                      size="medium"
                    />
                  }
                  label={t('published')}
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
                      onChange={(e) => onChange(e.target.checked)}
                      color="primary"
                      size="medium"
                    />
                  }
                  label={t('vectorData')}
                  sx={{ '.MuiSwitch-switchBase': { margin: 0 } }}
                />
              )}
            />
          </div>
          <br />
          <Button data-testid={'sourcebutton'} type="submit" variant="outlined">
            {isEditMode ? t('buttons.update') : t('buttons.submit')}
          </Button>
          <Button
            onClick={() => {
              setYear(null);
              reset();
            }}
            variant={'outlined'}
          >
            {t('buttons.reset')}
          </Button>
        </form>
      </Box>
    </Paper>
  );
}
