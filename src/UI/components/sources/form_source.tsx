import {Paper, Box, Button, Typography} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  TextField,
} from '@mui/material';
import React from 'react';


const defaultValues = {
    author: '',
    article_title: '',
    journal_title: '',
    citation: '',
    year: 0,
    published: true || false,
    report_type: '',
    v_data: true || false,
   
};

export default function FormSource() {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({defaultValues});

  const onSubmit = (data: typeof defaultValues) => {
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
                render = {({
                    field:{onChange, value},
                }) => (
                    <TextField
                        onChange={onChange}
                        value={value || ''}
                        type = "number"
                        label={"Year:"}
                    
                    ></TextField>
                )}
 
                /> 

            </div>
         <br />
         <div>
             <Controller
                name='report_type'
                control={control}
                render = {({
                    field:{onChange, value},
                }) => (
                    <TextField
                        onChange={onChange}
                        value={value || ''}
                        label={"Report Type:"}
                    
                    ></TextField>
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
                render={({ field:{onChange, value} }) => (
            <>
              <FormLabel>Vector Data: </FormLabel>
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
             <div>
                <br />
             <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      <Button onClick={() => reset()} variant={"outlined"}>Reset</Button>
        </div>
    </form>
    </Box>
    </Paper>
    </>
  );
}
