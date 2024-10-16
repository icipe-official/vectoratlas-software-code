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
import { assignPrimaryReviewer, assignTertiaryReviewer, fetchAllUsers, fetchAllUsersByRole, fetchAllUsersDetails } from '../../api/api';
import Swal from 'sweetalert2';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useAppSelector } from '../../state/hooks';

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
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [comments, setComments] = useState("");
  const { user } = useUser();
  const isReviewer = useAppSelector((state) => state.auth.roles.includes('reviewer'));
 
  // if(user) {
  //   console.log("User: :", user);
  // }

  useEffect(() => {
    const fetchReviewers = async () => {
      // const users = [
      //   {
      //     auth0_id: "1",
      //     name: "Lovestrant Kemboi",
      //     email: "kemboilovestrant@gmail.com"
      //   },
      //   {
      //     auth0_id: "2",
      //     name: "Mandela Mitau",
      //     email: "mmitau@gmail.com",
      //   },
      //   {
      //     auth0_id: "3",
      //     name: "Peter Gitu",
      //     email: "pgitu@gmail.com"
      //   }
      // ];
      // setUsers(users);

      try {
        const response = await fetchAllUsersByRole("reviewer");
        console.log("Users Data: ", response);
  
        if (response && response.length > 0) {
          // Fetch full user details for each reviewer using their auth0_id
          const userDetailsPromises = response.map(async (user: any) => {
            const userDetails = await fetchAllUsersDetails(user.auth0_id);
            return {
              ...user,
              ...userDetails,
            };
          });
  
          // Wait for all promises to resolve
          const fullUserDetails = await Promise.all(userDetailsPromises);
          console.log("Full User Details:", fullUserDetails);
  
          // Set the state with full user details
          setUsers(fullUserDetails);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchReviewers();
  }, []);

  const handleButtonClick = async () => {
    if (selectedUsers.length > 0 && datasetId && comments) {
      try {
        // Extract emails from selected users
        const reviewers = selectedUsers.map(user => user.email); 
  
        let result;
        if(assignmentType === "primaryReview") {
           result = await assignPrimaryReviewer(datasetId, reviewers, comments);
        }else if(assignmentType === "tertiaryReview") {
           result = await assignTertiaryReviewer(datasetId, reviewers, comments);
        }

        if (result === "Success") {
          Swal.fire({
            icon: 'success',
            title: 'Dataset Assigned Successfully',
            text: 'The dataset has been assigned to the selected reviewers.',
            confirmButtonText: 'Okay',
          });
          
        } else {
          // Handle failure case if the result is not successful
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
          Please select reviewers from the list below:
        </Typography>
        <Autocomplete
          multiple 
          options={users} 
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Reviewers" variant="outlined" />
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
          disabled={selectedUsers.length === 0}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignReviewerDialog;
