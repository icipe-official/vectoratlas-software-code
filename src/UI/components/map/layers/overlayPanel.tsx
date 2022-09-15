import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


const ToDo= ({toDo}) => {
    return (
        <div style={{display:'flex', justifyContent:"center",}}>
            <TextField sx={{backgroundColor:"rgba(102, 25, 107,0.2)"}} ype = "text" onChange={handleTaskEdit} value={editForm}></TextField>
            <Button data-testid="editToggleOff" startIcon={<DoneIcon/>} onClick={handleEditToggleOFF}></Button>
        </div>
    );
};
export {Overlay}