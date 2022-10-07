import { Paper, Typography, Divider, Box, Grid } from '@mui/material';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import {TextField} from '@material-ui/core'
import React from 'react';
import * as yup from 'yup';

interface IFormInputs{
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
  article_title: yup.string(),
  journal_title: yup.string(),
  citation: yup.string().required(),
  year: yup.string(),
  published: yup.boolean(),
  report_type: yup.string(),
  v_data: yup.boolean()
  
})

export default function SourceForm() {
      const {
        register, 
        control,
        handleSubmit, 
        watch, 
        formState:{errors}} = useForm<IFormInputs>({
          resolver: yupResolver(schema)
        });

      console.log('errors', errors);
      console.log('watch variable author', watch('author'));

      const formSubmitHandler: SubmitHandler<IFormInputs> = (data: IFormInputs) => {
        console.log('Form data is ', data)
      }
   
  
    return (
      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <div>
        <Controller 
          name="author" 
          control={control}
          render= {({field}) => (
          <TextField {...field} 
          type='text'
          label= "Author:" 
          variant='outlined'
          />
          )}/>
          <br />
       {/* <input {...register('author')}/> */}
        </div>
        <br />
        <div>
        <Controller 
          name="article_title" 
          control={control}
          render= {({field}) => (
          <TextField {...field} 
          type='text'
          label= "Article title:" 
          variant='outlined'/>
          )}/>
          <br />
        {/* <input {...register('article_title')}/> */}
        </div>
        <br />
        <div>
        <Controller 
          name="journal_title" 
          control={control}
          render= {({field}) => (
          <TextField {...field} 
          type='text'
          label= "Journal title:" 
          variant='outlined'/>
          )}/><br />
        {/* <input {...register('journal_title')}/> */}
        </div>
        <br />
        <div>
        <Controller 
        name="citation" 
        control={control}
        render= {({field}) => (
          <TextField{...field} 
          label= 'Citation:' 
          variant='outlined'
          error={!!errors.citation}
          helperText={errors.citation ? errors.citation?.message : ''} />
        )} />
          
        {/* <input {...register('citation')}/> */}
        {/* {errors.citation && errors.citation?.message && <span>{errors.citation.message}</span>}  */}
        </div>
        <br />
        <div>
        <Controller 
          name="year" 
          control={control}
          render= {({field}) => (
          <TextField {...field} 
          type='number'
          label= "Year:" 
          variant='outlined'/>
          )}/><br />
        {/* <input {...register('year')}/> */}
        </div>
        <br />
        <div>
        <Controller 
          name="published" 
          control={control}
          render= {({field}) => (
          <TextField {...field} 
          type='text'
          label= "Published:" 
          variant='outlined'/>
          )}/><br />
        {/* <input {...register('published')}/> */}
        </div>
        <br />
        <div>
        <Controller 
          name="report_type" 
          control={control}
          render= {({field}) => (
          <TextField {...field} 
          type='text'
          label= "Report type:" 
          variant='outlined'/>
          )}/><br />
        {/* <input {...register('report_type')}/> */}
        </div>
        <br />
        <div>
        <Controller 
          name="v_data" 
          control={control}
          render= {({field}) => (
          <TextField {...field} 
          type='text'
          label= "V_data:" 
          variant='outlined'/>
          )}/><br />
        {/* <input {...register('v_data')}/> */}
        </div>
        <br />
        <input type="submit" />
        {/* <div>
        <label htmlFor="id">ID:</label>
        <input id="id" type="text" name="id" placeholder="ID" />
        </div>
 */}

       {/*  <ValidationError prefix="Email" field="email" errors={state.errors} />
        <textarea id="message" name="message" />
        <ValidationError prefix="Message" field="message" errors={state.errors} />
        <button type="submit" disabled={state.submitting}>
          Submit
        </button>
        <ValidationError errors={state.errors} /> */}
      </form>
  );
}
