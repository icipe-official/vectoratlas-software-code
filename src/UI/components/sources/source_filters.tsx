import { Box, TextField } from "@mui/material";
import { debounce } from 'lodash';
import { useCallback } from "react";
import { useAppDispatch } from "../../state/hooks";
import { changeFilterId, changeFilterText, getSourceInfo } from "../../state/sourceSlice";

export default function SourceFilters(): JSX.Element {
  const dispatch = useAppDispatch();
  const idHandler = useCallback(debounce((value) => {
    dispatch(changeFilterId(value));
    dispatch(getSourceInfo());
  }, 1000), [])
  const textHandler = useCallback(debounce((value) => {
    dispatch(changeFilterText(value));
    dispatch(getSourceInfo());
  }, 1000), [])

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    idHandler(event.target.value)
  }
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    textHandler(event.target.value)
  }


  return (
    <Box sx={{ display: 'flex', width:'50%', alignItems: 'flex-end', paddingBottom:'10px', float:'right' }}>
      <TextField
        id="id-filter"
        label="Filter by id (e.g. 100-200)"
        variant="standard"
        sx={{paddingRight:'20px'}}
        onChange={handleIdChange}
      />
      <TextField
        id="title-filter"
        sx={{width: '60%'}}
        label="Filter by Title"
        variant="standard"
        onChange={handleTitleChange}
      />
    </Box>
  )
}