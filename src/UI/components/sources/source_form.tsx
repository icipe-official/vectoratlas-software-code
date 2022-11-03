import {Paper, Box, Button, Typography} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import router from 'next/router';
import {
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  TextField,
} from '@mui/material';
import React from 'react';
import * as yup from 'yup';

interface IFormInputs {
  author: string;
  article_title: string;
  journal_title: string;
  citation: string;
  year: number;
  published: boolean;
  report_type: string;
  v_data: boolean;
};

const schema = yup.object().shape({
  author: yup.string(),
  article_title: yup.string().required(),
  journal_title: yup.string(),
  citation: yup.string().required(),
  year: yup.string(),
  published: yup.boolean(),
  report_type: yup.string(),
  v_data: yup.boolean(),
});

export default function SourceForm() {
  const {
    register,
    reset,
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  // const formSubmitHandler: SubmitHandler<IFormInputs> = (data) => {
    
  //   console.log('form data is', data);
    
  // };
  const onSubmit = (data: IFormInputs) => {
    console.log(data);
  }

 return (
    <>
    <Paper
          sx={{
            width: '100%',
            height: '100%',
            justifyContent: 'justify-between',
            alignItems: 'center',
          }}
        >
   <Box p="35px" sx={{ width: 1 }}>
    <form onSubmit={ handleSubmit(onSubmit)}>
      <div>
      <Typography variant="h4" color="primary" pb={1}>
                    <strong>ADD A NEW REFERENCE SOURCE</strong>
                  </Typography>
                  <br />
                  </div>
                  <div>
             <Controller
                name='author'
                control={control}
                render = {({
                    field:{onChange, value},
                }) => (
                    <TextField
                        onChange={onChange}
                        value={value || ''}
                        label={"Author:"}
                    
                    ></TextField>
                )}
 
                /> 

            </div>

      <br />
      <div>
             <Controller
                name='article_title'
                control={control}
                render = {({
                    field:{onChange, value}, fieldState: {error}
                }) => (
                    <TextField
                        onChange={onChange}
                        value={value || ''}
                        label={"Article Title:"}
                        error={!!error}
                        helperText={error ? error.message : null}
                    ></TextField>
                )}

                rules={{ required: 'Article Title required' }}
                />
             </div>
      <br />

      <div>
             <Controller
                name='journal_title'
                control={control}
                render = {({
                    field:{onChange, value},
                }) => (
                    <TextField
                        onChange={onChange}
                        value={value || ''}
                        label={"Journal Title:"}
                    
                    ></TextField>
                )}
 
                /> 

            </div>
      <br />

      <div>
        <Controller
          name='year' 
          control={control}
          render={({ field:{onChange, value}  }) => (
            <TextField
              value={value || '' }
              onChange={onChange}
              type="number"
              label="Year:"
              variant="outlined"
            ></TextField>
          )}
        />
      </div>
      <br />

      <div>
        <Controller
          name='report_type'
          control={control}
          render={({ field:{onChange, value}  }) => (
            <TextField
              value={value || ''}
              onChange={onChange}
              type="text"
              label="Report type:"
              variant="outlined"
            ></ TextField>
          )}
        />
      </div>
      <br />

      <div>
        <Controller
          name='published'
          control={control}
          render={({ field:{onChange, value} }) => (
            <>
              <FormLabel>Published: </FormLabel>
              <RadioGroup onChange={onChange} >
                <FormControlLabel
                  value="True"
                  control={<Radio />}
                  label="True"
                  
                ></FormControlLabel>
                <FormControlLabel
                  value="False"
                  control={<Radio />}
                  label="False"

                ></FormControlLabel>
              </RadioGroup>
            </>
          )}
        />
      </div>

      <br />
      <div>
        <Controller
          name='v_data'
          control={control}
          render={({  field: { onChange, value }}) => (
            <>
              <FormLabel>Vector Data: </FormLabel>
              <RadioGroup onChange={onChange}>
                <FormControlLabel
                  value="True"
                  control={<Radio />}
                  label="True"

                ></FormControlLabel>
                <FormControlLabel
                  value="False"
                  control={<Radio />}
                  label="False"

                ></FormControlLabel>
              </RadioGroup>
            </>
          )}
        />
      </div>
      <br />
      
      <div>
      <Button   size="large" onClick={handleSubmit(onSubmit)} >
         SUBMIT
          </Button>
          <Button onClick={() => reset()} variant={"outlined"}>Reset</Button>
          </div>

    </form>
    </Box>
    </Paper>
    </>
  );
}
