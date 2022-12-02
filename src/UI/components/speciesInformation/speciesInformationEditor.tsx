import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { TextEditor } from '../shared/textEditor/RichTextEditor';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  getSpeciesInformation,
  upsertSpeciesInformation,
} from '../../state/speciesInformation/actions/upsertSpeciesInfo.action';
import { SpeciesInformation } from '../../state/state.types';

const SpeciesInformationEditor = () => {
  const [description, setDescription] = useState('test description');
  const [initialDescription, setInitialDescription] = useState(
    'initial description'
  );
  const [shortDescription, setShortDescription] = useState('');
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const currentSpeciesInformation = useAppSelector(
    (s) => s.speciesInfo.currentInfoForEditing
  );

  const router = useRouter();
  const id = router.query.id as string | undefined;

  const saveSpeciesInformation = useCallback(() => {
    const speciesInformation: SpeciesInformation = {
      id,
      name,
      shortDescription,
      description,
    };
    dispatch(upsertSpeciesInformation(speciesInformation));
  }, [dispatch, id, description, name, shortDescription]);

  useEffect(() => {
    if (id) {
      dispatch(getSpeciesInformation(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentSpeciesInformation) {
      setName(currentSpeciesInformation.name);
      setShortDescription(currentSpeciesInformation.shortDescription);
      console.log(currentSpeciesInformation.description);
      setDescription(currentSpeciesInformation.description);
      setInitialDescription(currentSpeciesInformation.description);
    }
  }, [currentSpeciesInformation]);

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
        {id ? 'Edit' : 'Create'} species information
      </Typography>
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Name
      </Typography>
      <TextField
        variant="outlined"
        sx={{ width: '100%' }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Short description
      </Typography>
      <TextField
        multiline
        rows={4}
        sx={{ width: '100%' }}
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
      />
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Full Description
      </Typography>
      <TextEditor
        description={description}
        setDescription={setDescription}
        initialDescription={initialDescription}
      />
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Species image
      </Typography>
      <div>Placeholder</div>
      <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
        Distribution map image
      </Typography>
      <div>Placeholder</div>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}
      >
        <Button
          variant="contained"
          onClick={saveSpeciesInformation}
          sx={{ m: 0, minWidth: 150 }}
        >
          {id ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

export default SpeciesInformationEditor;
