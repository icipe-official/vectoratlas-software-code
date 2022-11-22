import { Button, Link, Paper } from '@mui/material'
import React from 'react'


export function DownloadMap() {


    return (
        <>

            <div id="map" className='map'></div>

            <Link
                
                id="export-png-draw"
                className="btn btn-outline-dark"
                underline='hover'
                variant='overline'
                fontSize='20px'
                style={{
                    display: 'flex',
                    justifyContent: 'center',


                }}>
                <Button variant="contained" size="medium">DOWNLOAD MAP IMAGE</Button>    
                </Link>
            <Link id="image-download" download="map.png"></Link>

        </>
    );
}
export default DownloadMap;
