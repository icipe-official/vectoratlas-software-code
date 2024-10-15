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
import { assignPrimaryReviewer, assignTertiaryReviewer, fetchAllUsersWithReviewerRole } from '../../api/api';
import Swal from 'sweetalert2';

interface User {
  id: string;
  name: string;
  email: string; // Added email field to the User interface
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
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]); // Changed to array for multiple selections
  const [comments, setComments] = useState("");

  useEffect(() => {
    const fetchReviewers = async () => {
      const users = [
        {
          id: "1",
          name: "Lovestrant Kemboi",
          email: "kemboilovestrant@gmail.com"
        },
        {
          id: "2",
          name: "Mandela Mitau",
          email: "mmitau@gmail.com",
        },
        {
          id: "3",
          name: "Peter Gitu",
          email: "pgitu@gmail.com"
        }
      ];
      setUsers(users);
      // Uncomment this if you want to fetch from API
      // try {
      //   const response = await fetchAllUsersWithReviewerRole();
      //   console.log("Users Data: ", response);
      //   setUsers(response); // Assuming response.data contains the user list
      // } catch (error) {
      //   console.error('Error fetching users:', error);
      // }
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
          multiple // Enable multiple selection
          options={users} // Use the fetched users array
          getOptionLabel={(option) => option.name} // Display the name of the user
          onChange={(event, newValue) => {
            setSelectedUsers(newValue); // Set the selected users array
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
          disabled={selectedUsers.length === 0} // Disable if no user is selected
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignReviewerDialog;
