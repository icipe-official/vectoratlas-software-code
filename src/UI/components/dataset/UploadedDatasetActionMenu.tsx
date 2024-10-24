import { Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { string } from 'yup';
import { UploadedDatasetStatusEnum } from '../../state/state.types';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { fetchAllUsers } from '../../api/api';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ClearIcon from '@mui/icons-material/Clear';
import { Mail } from '@mui/icons-material';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import { toast } from 'react-toastify';
import { createDynamicComponent } from '../../utils/utils';
import { DatasetActionTypeEnum } from './dataset.action.types';
import {
  approveUploadedDataset,
  rejectUploadedDataset,
} from '../../state/uploadedDataset/actions/uploaded-dataset.action';

interface UploadedDatasetActionMenuProps {
  status: string;
  anchorEl: HTMLElement;
  open: boolean;
  onClose: () => void;
  onAssignReviewer: () => void;
  onApprove: () => void;
  onReject: () => void;
}

interface IUser {
  auth0_id: string;
  is_uploader: boolean;
  is_reviewer: boolean;
  is_admin: boolean;
  is_editor: boolean;
  is_reviewer_manager: boolean | null;
}

/**
 * Construct actions menu depending on status of uploaded dataset
 * @returns
 */
export const UploadedDatasetActionMenu = (
  props: UploadedDatasetActionMenuProps
) => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.uploadedDataset.loading);
  const selectedDataset = useAppSelector(
    (state) => state.uploadedDataset.currentUploadedDataset
  );

  const [assignmentType, setAssignmentType] = useState<string>('');
  const [actionType, setActionType] = useState<string>('');
  const [users, setUsers] = useState<IUser[]>();
  const [anchorEl, setAnchorEl] = React.useState(props.anchorEl); // React.useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(props.open);
  const loadUsers = async () => {
    const res: any[] = await fetchAllUsers();
    setUsers(res);
  };

  const handleMenuClose = () => {
    props.onClose();
  };

  const handleAction = async () => {
    switch (actionType) {
      case DatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWER:
        break;
      case DatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWER:
        break;
      case DatasetActionTypeEnum.UPLOAD_PRIMARY_REVIEWED_DATASET:
        break;
      case DatasetActionTypeEnum.UPLOAD_TERTIARY_REVIEWED_DATASET:
        break;
      case DatasetActionTypeEnum.REJECT:
        break;
      case DatasetActionTypeEnum.APPROVE:
        // await approveUploadedDataset()
        break;
      case DatasetActionTypeEnum.SEND_EMAIL:
        break;
      default:
        break;
    }
    handleMenuClose();
  };

  useEffect(() => {
    const load = async () => {
      await loadUsers();
    };
    load();
  }, []);

  useEffect(() => {
    setAnchorEl(props.anchorEl);
  }, [props.anchorEl]);

  useEffect(() => {
    setMenuOpen(anchorEl != null);
  }, [anchorEl]);

  const getActions = () => {
    let menuItems = [
      <MenuItem
        key={1}
        onClick={async () => {
          toast.success('Clicked');
          // setDialogOpen(true);
          // await selectDataset(params.row.id);
          // setAssignmentType('primaryReview');
          // handleMenuClose();
        }}
      >
        <AssignmentIcon fontSize="small" /> Assign Primary Reviewer
      </MenuItem>,
    ];
    if (props.status === UploadedDatasetStatusEnum.PENDING) {
      if (users?.some((user) => user.is_reviewer_manager)) {
        menuItems = menuItems.concat(
          <MenuItem
            key={1}
            onClick={async () => {
              // setDialogOpen(true);
              // await selectDataset(params.row.id);
              // setAssignmentType('primaryReview');
              // handleMenuClose();
              setAssignmentType(DatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWER);
              handleAction();
            }}
          >
            <AssignmentIcon fontSize="small" /> Assign Primary Reviewer
          </MenuItem>
        );
      }
    }

    if (props.status === UploadedDatasetStatusEnum.PRIMARY_REVIEW) {
      menuItems = menuItems.concat([
        <MenuItem
          key={2}
          onClick={() => {
            setAssignmentType(
              DatasetActionTypeEnum.UPLOAD_PRIMARY_REVIEWED_DATASET
            );
            handleAction();
          }}
        >
          <UploadIcon fontSize="small" />
          First Upload
        </MenuItem>,

        <MenuItem
          key={3}
          onClick={async () => {
            // await selectDataset(params.row.id);
            // handleDatasetReject();
            // setRejectType('beforeApproval');
            setAssignmentType(DatasetActionTypeEnum.REJECT);
            handleAction();
          }}
        >
          <ClearIcon fontSize="small" /> Reject
        </MenuItem>,

        <MenuItem
          key={4}
          onClick={
            () => {
              setAssignmentType(DatasetActionTypeEnum.SEND_EMAIL);
              handleAction();
            } /*handleOpenPopup*/
          }
        >
          <Mail fontSize="small" />
          Send Email
        </MenuItem>,
      ]);
    }

    if (
      props.status ===
      UploadedDatasetStatusEnum.PENDING_ASSIGNING_TERTIARY_REVIEW
    ) {
      if (users?.some((user) => user.is_reviewer_manager)) {
        menuItems = menuItems.concat(
          <MenuItem
            key={5}
            onClick={async () => {
              // setDialogOpen(true);
              // await selectDataset(params.row.id);
              // setAssignmentType('tertiaryReview');
              // handleMenuClose();
              setAssignmentType(DatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWER);
              handleAction();
            }}
          >
            <AssignmentIcon fontSize="small" /> Assign Tertiary Reviewer
          </MenuItem>
        );
      }
    }
    if (props.status === UploadedDatasetStatusEnum.TERTIARY_REVIEW) {
      menuItems = menuItems.concat([
        <MenuItem
          key={6}
          onClick={() => {
            setAssignmentType(
              DatasetActionTypeEnum.UPLOAD_TERTIARY_REVIEWED_DATASET
            );
            handleAction();
          }}
        >
          <UploadIcon fontSize="small" /> Send Upload
        </MenuItem>,

        <MenuItem
          key={7}
          onClick={async () => {
            // await selectDataset(params.row.id);
            // handleDatasetReject();
            // setRejectType('afterApproval');
            setAssignmentType(DatasetActionTypeEnum.REJECT);
            handleAction();
          }}
        >
          <ClearIcon fontSize="small" /> Reject
        </MenuItem>,
        <MenuItem
          key={8}
          onClick={() => {
            setAssignmentType(DatasetActionTypeEnum.SEND_EMAIL);
            handleAction();
          }}
        >
          <Mail fontSize="small" /> Send Email
        </MenuItem>,
      ]);
    }
    if (props.status === UploadedDatasetStatusEnum.PENDING_APPROVAL) {
      if (users?.some((user) => user.is_reviewer_manager)) {
        menuItems = menuItems.concat(
          <MenuItem
            onClick={() => {
              setAssignmentType(DatasetActionTypeEnum.APPROVE);
              handleAction();
            }}
          >
            <CheckIcon fontSize="small" /> Approve
          </MenuItem>
        );
      }
    }
    return menuItems;
  };

  return (
    <Menu
      open={menuOpen}
      // id="menu-appbar"
      // anchorEl={props.anchorEl || null}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      //open={Boolean(anchorEl)}
      //open={anchorEl != null ? true : false}
      // onClose={handleClose}

      anchorEl={anchorEl}
      // open={Boolean(anchorEl) && selectedRow?.id === params.row.id}
      onClose={handleMenuClose}
    >
      {/* <MenuItem>Menu one/two</MenuItem> */}
      {getActions()?.map((Component, index) => {
        console.log('Child menu: ', Component);
        const dynamicComponent = createDynamicComponent(MenuItem, {
          ...Component.props,
        });
        return dynamicComponent;
      })}

      {/* {getActions()?.map((component, index) => (
        <ChildMenu key={index}></ChildMenu>
      ))} */}
    </Menu>
  );
};
