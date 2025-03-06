import {
  Container,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { string } from 'yup';
import { RolesEnum, UploadedDatasetStatusEnum } from '../../state/state.types';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { fetchAllUsers } from '../../api/api';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ClearIcon from '@mui/icons-material/Clear';
import { Mail } from '@mui/icons-material';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import { toast } from 'react-toastify';
import { createDynamicComponent } from '../../utils/utils';
import { UploadedDatasetActionTypeEnum } from '../../state/state.types';
import {
  approveUploadedDataset,
  rejectUploadedDataset,
} from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import AssignReviewerDialog from './AssignReviewerDialog';
import { UploadedDatasetActionDialog } from './UploadedDatasetActionDialog';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import PlaceIcon from '@mui/icons-material/Place';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from 'next/router';

interface UploadedDatasetActionMenuProps {
  status: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  inFormView: boolean;
  onClose: () => void;
}

interface IUser {
  auth0_id: string;
  is_uploader: boolean;
  is_reviewer: boolean;
  is_admin: boolean;
  is_editor: boolean;
  is_reviewer_manager: boolean | null;
  disable_notifications: boolean;
}

/**
 * Construct actions menu depending on status of uploaded dataset
 * @returns
 */
export const UploadedDatasetActionMenu = (
  props: UploadedDatasetActionMenuProps
) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.uploadedDataset.loading);
  const dataset = useAppSelector(
    (state) => state.uploadedDataset.currentUploadedDataset
  );

  const selectedDataset = useAppSelector(
    (state) => state.uploadedDataset.currentUploadedDataset
  );
  const roles = useAppSelector((state) => state.auth.roles);
  const user = useAppSelector((state) => state.auth.id);
  // const [assignmentType, setActionType] = useState<string>('');
  const [actionType, setActionType] = useState<UploadedDatasetActionTypeEnum>(
    UploadedDatasetActionTypeEnum.NONE
  );
  // const [users, setUsers] = useState<IUser[]>();
  const [anchorEl, setAnchorEl] = React.useState(props.anchorEl); // React.useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(props.open);
  const [dialogOpen, setdialogOpen] = useState<boolean>(false);
  // const loadUsers = async () => {
  //   const res: any[] = await fetchAllUsers();
  //   setUsers(res);
  // };

  const handleMenuClose = () => {
    props.onClose();
  };

  // useEffect(() => {
  //   const load = async () => {
  //     await loadUsers();
  //   };
  //   load();
  // }, []);

  useEffect(() => {
    setAnchorEl(props.anchorEl);
  }, [props.anchorEl]);

  useEffect(() => {
    setMenuOpen(anchorEl != null);
  }, [anchorEl]);

  const validateAction = (currentStatus: string) => {
    let valid = false;
    switch (currentStatus) {
      case UploadedDatasetStatusEnum.PENDING:
        // only review managers can assign
        if (roles.includes(RolesEnum.REVIEWER_MANAGER.toString())) {
          return true;
        }
        break;

      case UploadedDatasetStatusEnum.PRIMARY_REVIEW:
        // only those assigned can perform actions on the dataset
        if (roles.includes(RolesEnum.REVIEWER.toString())) {
          if (dataset.primary_reviewers.includes(user)) {
            return true;
          }
        }
        break;

      case UploadedDatasetStatusEnum.PENDING_ASSIGNING_TERTIARY_REVIEW:
        // only review managers can assign
        if (roles.includes(RolesEnum.REVIEWER_MANAGER.toString())) {
          return true;
        }
        break;

      case UploadedDatasetStatusEnum.TERTIARY_REVIEW:
        // only those assigned can perform actions on the dataset
        if (roles.includes(RolesEnum.REVIEWER.toString())) {
          if (dataset.tertiary_reviewers.includes(user)) {
            return true;
          }
        }
        break;

      case UploadedDatasetStatusEnum.PENDING_APPROVAL:
        // only review managers can approve
        if (roles.includes(RolesEnum.REVIEWER_MANAGER.toString())) {
          return true;
        }
        break;

      case UploadedDatasetStatusEnum.APPROVED:
        // Anyone can view data on the map
        return true;
        break;

      default:
        break;
    }
  };

  const getActions = () => {
    const status = selectedDataset?.status;
    let index = 1;
    let menuItems: any[] = [];
    if (!selectedDataset) {
      return menuItems;
    }
    const isActionValidated = validateAction(selectedDataset.status);
    if (!isActionValidated) {
      return menuItems;
    }

    if (!props.inFormView) {
      menuItems = menuItems.concat(
        <MenuItem
          key={++index}
          onClick={async () => {
            setActionType(UploadedDatasetActionTypeEnum.VIEW_DETAILS);
            router.push({
              pathname: `/uploaded-dataset/${selectedDataset?.id}`,
            });
          }}
        >
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {UploadedDatasetActionTypeEnum.VIEW_DETAILS}
          </ListItemText>
        </MenuItem>
      );
    }

    if (status === UploadedDatasetStatusEnum.APPROVED) {
      menuItems = menuItems.concat(
        <MenuItem
          key={++index}
          onClick={async () => {
            setActionType(UploadedDatasetActionTypeEnum.VIEW_MAP);
            router.push({
              pathname: '/map',
            });
          }}
        >
          <ListItemIcon>
            <PlaceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{UploadedDatasetActionTypeEnum.VIEW_MAP}</ListItemText>
        </MenuItem>
      );
    }
    if (status === UploadedDatasetStatusEnum.PENDING) {
      menuItems = menuItems.concat(
        <MenuItem
          key={++index}
          onClick={async () => {
            setActionType(
              UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS
            );
            setdialogOpen(true);
          }}
        >
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS}
          </ListItemText>
        </MenuItem>
      );
    }
    if (status === UploadedDatasetStatusEnum.PRIMARY_REVIEW) {
      if (!selectedDataset.is_reupload_requested) {
        menuItems = menuItems.concat([
          <MenuItem
            key={++index}
            onClick={() => {
              setActionType(UploadedDatasetActionTypeEnum.REQUEST_REUPLOAD);
              setdialogOpen(true);
            }}
          >
            <ListItemIcon>
              <UploadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {UploadedDatasetActionTypeEnum.REQUEST_REUPLOAD}
            </ListItemText>
          </MenuItem>,
        ]);
      }

      menuItems = menuItems.concat([
        <MenuItem
          key={++index}
          onClick={() => {
            setActionType(
              UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW
            );
            setdialogOpen(true);
          }}
        >
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW}
          </ListItemText>
        </MenuItem>,

        <MenuItem
          key={++index}
          onClick={async () => {
            setActionType(UploadedDatasetActionTypeEnum.REJECT);
            setdialogOpen(true);
          }}
        >
          <ListItemIcon>
            <ClearIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{UploadedDatasetActionTypeEnum.REJECT}</ListItemText>
        </MenuItem>,

        <MenuItem
          key={++index}
          onClick={() => {
            setActionType(UploadedDatasetActionTypeEnum.SEND_EMAIL);
            setdialogOpen(true);
          }}
        >
          <ListItemIcon>
            <Mail fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {UploadedDatasetActionTypeEnum.SEND_EMAIL}
          </ListItemText>
        </MenuItem>,
      ]);
    }
    if (
      status === UploadedDatasetStatusEnum.PENDING_ASSIGNING_TERTIARY_REVIEW
    ) {
      menuItems = menuItems.concat(
        <MenuItem
          key={++index}
          onClick={async () => {
            setActionType(
              UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS
            );
            setdialogOpen(true);
          }}
        >
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS}
          </ListItemText>
        </MenuItem>
      );

      menuItems = menuItems.concat(
        <MenuItem
          key={++index}
          onClick={() => {
            setActionType(UploadedDatasetActionTypeEnum.SEND_EMAIL);
            setdialogOpen(true);
          }}
        >
          <ListItemIcon>
            <Mail fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {UploadedDatasetActionTypeEnum.SEND_EMAIL}
          </ListItemText>
        </MenuItem>
      );
    }
    if (status === UploadedDatasetStatusEnum.TERTIARY_REVIEW) {
      menuItems = menuItems.concat([
        <MenuItem
          key={++index}
          onClick={() => {
            setActionType(
              UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW
            );
            setdialogOpen(true);
          }}
        >
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW}
          </ListItemText>
        </MenuItem>,

        <MenuItem
          key={++index}
          onClick={async () => {
            setActionType(UploadedDatasetActionTypeEnum.REJECT);
            setdialogOpen(true);
          }}
        >
          <ListItemIcon>
            <ClearIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{UploadedDatasetActionTypeEnum.REJECT}</ListItemText>
        </MenuItem>,
        <MenuItem
          key={++index}
          onClick={() => {
            setActionType(UploadedDatasetActionTypeEnum.SEND_EMAIL);
            setdialogOpen(true);
          }}
        >
          <ListItemIcon>
            <Mail fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {UploadedDatasetActionTypeEnum.SEND_EMAIL}
          </ListItemText>
        </MenuItem>,
      ]);
    }
    if (status === UploadedDatasetStatusEnum.PENDING_APPROVAL) {
      if (
        roles.includes(RolesEnum.REVIEWER_MANAGER) ||
        roles.includes(RolesEnum.REVIEWER)
      ) {
        menuItems = menuItems.concat(
          <MenuItem
            key={++index}
            onClick={() => {
              setActionType(UploadedDatasetActionTypeEnum.VALIDATE);
              setdialogOpen(true);
            }}
          >
            <ListItemIcon>
              <RuleFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {UploadedDatasetActionTypeEnum.VALIDATE}
            </ListItemText>
          </MenuItem>
        );
      }
      if (roles.includes(RolesEnum.REVIEWER_MANAGER)) {
        menuItems = menuItems.concat(
          <MenuItem
            key={++index}
            onClick={() => {
              setActionType(UploadedDatasetActionTypeEnum.APPROVE);
              setdialogOpen(true);
            }}
          >
            <ListItemIcon>
              <CheckIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{UploadedDatasetActionTypeEnum.APPROVE}</ListItemText>
          </MenuItem>
        );
      }
      menuItems = menuItems.concat(
        <MenuItem
          key={++index}
          onClick={() => {
            setActionType(UploadedDatasetActionTypeEnum.SEND_EMAIL);
            setdialogOpen(true);
          }}
        >
          <ListItemIcon>
            <Mail fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {UploadedDatasetActionTypeEnum.SEND_EMAIL}
          </ListItemText>
        </MenuItem>
      );
    }
    return menuItems;
  };

  const actionMenuItems = getActions();
  if (actionMenuItems.length == 0) {
    return <div></div>;
  }
  return (
    <div>
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
        {actionMenuItems.map((Component, index) => {
          const dynamicComponent = createDynamicComponent(MenuItem, {
            ...Component.props,
            key: index,
          });
          return dynamicComponent;
        })}

        {/* {getActions()?.map((component, index) => (
        <ChildMenu key={index}></ChildMenu>
      ))} */}
      </Menu>
      <UploadedDatasetActionDialog
        isOpen={dialogOpen}
        datasetId={selectedDataset?.id}
        action={actionType}
        onOk={() => {
          setActionType(UploadedDatasetActionTypeEnum.NONE);
          setdialogOpen(false);
          handleMenuClose();
        }}
        onCancel={() => {
          setActionType(UploadedDatasetActionTypeEnum.NONE);
          setdialogOpen(false);
          handleMenuClose();
        }}
      />
    </div>
  );
};
