import { Avatar, Button, Grid, List, ListItem, ListItemAvatar, TextField } from "@mui/material";


function ReviewForm(props: any){
    const download_data= () =>{
        alert("Attempt to download dataset identified by: "+props?.dataset_id)
    }

    if(props.dataset_id){
        return (
        <div>
            <form>
                <div>
                    <TextField id="outlined-basic" value={props.dataset_id} label="Dataset ID" variant="outlined" />
                </div>
                <div>
                    <Button variant="contained" onClick={download_data}>Download csv</Button>
                </div>
            </form>
        </div>
        ) 
    }else{
        return (
            <p>Sorry! dataset_id not provided.</p>
        )
    }
}

export default ReviewForm;