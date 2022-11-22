import { Button, Link, Paper } from '@mui/material'
import React from 'react'

export default function MapDownload(): JSX.Element {

  return (
    <>

    <div id="map" className='map'></div>

   <Link 
        id="export-png" 
        className="btn btn-outline-dark" 
        role="button"
        underline='hover'
        variant='overline'
        fontSize='20px'
        style={
            {   display: 'flex', 
                justifyContent: 'center' ,
                
                
             }
        }>
            <i className="fa fa-download"></i> DOWNLOAD MAP IMAGE</Link>
    <Link id="image-download" download="map.png"></Link>

    </>
  )
};

