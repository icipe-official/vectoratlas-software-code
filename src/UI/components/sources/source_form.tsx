import {Paper, Box, Button, Typography} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import router from 'next/router';
import {
  Radio,
  RadioGroup,
  FormControl,
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
}

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
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });
  
  const [value, setValue] = useState();

  const formSubmitHandler: SubmitHandler<IFormInputs> = (data) => {
    
    console.log('form data is', data);
  };

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
    <form onSubmit={ handleSubmit(formSubmitHandler)}>
      <div>
      <Typography variant="h4" color="primary" pb={1}>
                    <strong>ADD A NEW REFERENCE SOURCE</strong>
                  </Typography>
                  <br />
        <Controller
          name='author'
          // {...register("author")} 
          control={control}
          render={({  field: { onChange, onBlur, value, name, ref } }) => (
            <TextField
              value={value || '' }
              onChange={onChange}
              type="text"
              label="Author:"
              variant="outlined"
            />
          )}
          
          
        />
        
        <br />
      </div>
      <br />
      <div>
        <Controller
        name='article_title'
          // {...register("article_title")} 
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="text"
              label="Article title:"
              variant="outlined"
            />
          )}
           {...errors.citation && errors.citation?.message && <span>{errors.citation.message}</span>}
        />
        <br />
      </div>
      <br />

      <div>
        <Controller
        name='journal_title'
          // {...register("journal_title")} 
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="text"
              label="Journal title:"
              variant="outlined"
            />
          )}
        />
        <br />
      </div>
      <br />

      <div>
        <Controller
        name='year'
          // {...register("year")} 
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Year:"
              variant="outlined"
            />
          )}
        />
        <br />
      </div>
      <br />

      <div>
        <Controller
        name='report_type'
          // {...register("report_type")} 
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="text"
              label="Report type:"
              variant="outlined"
            />
          )}
        />
        <br />
      </div>
      <br />

      <div>
        <Controller
        name='published'
          // {...register("published")} 
          control={control}
          render={({ field }) => (
            <>
              <FormLabel>Published: </FormLabel>
              <RadioGroup defaultValue="">
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
        <br />
      </div>

      <div>
        <Controller
          name='v_data'
          // {...register("v_data")} 
          control={control}
          render={({  field: { onChange, onBlur, value, name, ref }}) => (
            <>
              <FormLabel>Vector Data: </FormLabel>
              <RadioGroup defaultValue="">
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
      <Button variant="contained"  size="large"  >
         SUBMIT
          </Button>
       

    </form>
    </Box>
    </Paper>
    </>
  );
}
