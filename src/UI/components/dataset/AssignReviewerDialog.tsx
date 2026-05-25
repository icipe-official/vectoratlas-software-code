import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Autocomplete,
} from '@mui/material';
import {
  assignPrimaryReviewersAuthenticated,
  assignTertiaryReviewersAuthenticated,
  fetchAllUsersByRole,
  fetchAllUsersDetails,
  fetchManyUsersDetails,
} from '../../api/api';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store';
import { RolesEnum } from '../../state/state.types';

interface User {
  auth0_id: string;
  name: string;
  email: string;
}

interface AssignReviewerDialogProps {
  open: boolean;
  onClose: () => void;
  datasetId: string | null;
  assignmentType: string;
}

const AssignReviewerDialog: React.FC<AssignReviewerDialogProps> = ({
  open,
  onClose,
  datasetId,
  assignmentType,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [comments, setComments] = useState('');
  const token = useSelector((state: AppState) => state.auth.token);

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        setUsers([]);
        const reviewers = await fetchAllUsersByRole(RolesEnum.REVIEWER);
        if (reviewers && reviewers.length > 0) {
          const reviewerIds = reviewers.map((usr: any) => usr.auth0_id);
          const users =
            reviewers.length > 0
              ? await fetchManyUsersDetails(token, reviewerIds)
              : [];
          setUsers(users);

          // const response = await fetchAllUsersByRole(RolesEnum.REVIEWER);
          // if (response && response.length > 0) {
          //   const userDetailsPromises = response.map(async (user: any) => {
          //     const userDetails = await fetchAllUsersDetails(
          //       token,
          //       user.auth0_id
          //     );
          //     return {
          //       ...user,
          //       ...userDetails,
          //     };
          //   });

          //   const fullUserDetails: User[] = await Promise.all(
          //     userDetailsPromises
          //   );
          //   setUsers(fullUserDetails);
          // }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchReviewers();
  }, [token]);

  const handleButtonClick = async () => {
    if (selectedUser && datasetId && comments) {
      // Check for single user
      try {
        // const result =
        //   assignmentType === 'primaryReview'
        //     ? await assignPrimaryReviewersAuthenticated(
        //         datasetId,
        //         [selectedUser.email],
        //         comment
        //       )
        //     : await assignTertiaryReviewersAuthenticated(
        //         datasetId,
        //         [selectedUser.email],
        //         comments
        //       );
        const result = false;
        if (result) {
          setComments('');
          Swal.fire({
            icon: 'success',
            title: 'Dataset Assigned Successfully',
            text: 'The dataset has been assigned to the selected reviewer.',
            confirmButtonText: 'Okay',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Assignment Failed',
            text: 'There was an issue assigning the dataset. Please try again.',
            confirmButtonText: 'Okay',
          });
        }
        onClose();
      } catch (error) {
        console.error('Error assigning dataset:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred. Please try again.',
          confirmButtonText: 'Okay',
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ minWidth: '400px' }}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Assign Reviewer
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          Please select a reviewer from the list below:
        </Typography>
        <Autocomplete
          options={users}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            setSelectedUser(newValue); // Set single user
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Reviewer" variant="outlined" />
          )}
        />
        <br />
        <TextField
          label="Comments"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleButtonClick}
          color="primary"
          disabled={!selectedUser} // Disable button if no user is selected
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignReviewerDialog;
