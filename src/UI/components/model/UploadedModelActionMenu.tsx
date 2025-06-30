import {
  Container,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { string } from 'yup';
import { RolesEnum, UploadedModelStatusEnum } from '../../state/state.types';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { fetchAllUsers } from '../../api/api';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ClearIcon from '@mui/icons-material/Clear';
import { Mail } from '@mui/icons-material';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import { toast } from 'react-toastify';
import { createDynamicComponent } from '../../utils/utils';
import { UploadedModelActionTypeEnum } from '../../state/state.types';
// import {
//   approveUploadedModel,
//   rejectUploadedModel,
// } from '../../state/uploadedModel/actions/uploaded-model.action';
// import AssignReviewerDialog from './AssignReviewerDialog';
import { UploadedModelActionDialog } from './UploadedModelActionDialog';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import PlaceIcon from '@mui/icons-material/Place';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

interface UploadedModelActionMenuProps {
  status: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  inFormView: boolean;
  onClose: () => void;
  defaultMenu?: React.ReactNode;
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
 * Construct actions menu depending on status of uploaded model
 * @returns
 */
export const UploadedModelActionMenu = (
  props: UploadedModelActionMenuProps
) => {
  const t = useTranslations('UploadedModelDetailPage');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.uploadedModel.loading);
  const model = useAppSelector(
    (state) => state.uploadedModel.currentUploadedModel
  );

  const selectedModel = useAppSelector(
    (state) => state.uploadedModel.currentUploadedModel
  );
  const roles = useAppSelector((state) => state.auth.roles);
  const user = useAppSelector((state) => state.auth.id);
  // const [assignmentType, setActionType] = useState<string>('');
  const [actionType, setActionType] = useState<UploadedModelActionTypeEnum>(
    UploadedModelActionTypeEnum.NONE
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
      case UploadedModelStatusEnum.PENDING:
        // only review managers can assign
        if (roles.includes(RolesEnum.REVIEWER_MANAGER.toString())) {
          return true;
        }
        break;

      case UploadedModelStatusEnum.PRIMARY_REVIEW:
        // only those assigned can perform actions on the model
        if (roles.includes(RolesEnum.REVIEWER.toString())) {
          if (model.primary_reviewers.includes(user)) {
            return true;
          }
        }
        break;

      case UploadedModelStatusEnum.PENDING_ASSIGNING_TERTIARY_REVIEW:
        // only review managers can assign
        if (roles.includes(RolesEnum.REVIEWER_MANAGER.toString())) {
          return true;
        }
        break;

      case UploadedModelStatusEnum.TERTIARY_REVIEW:
        // only those assigned can perform actions on the model
        if (roles.includes(RolesEnum.REVIEWER.toString())) {
          if (
            (!model.is_tertiary_review_reassigned &&
              model.tertiary_reviewers.includes(user)) ||
            (model.is_tertiary_review_reassigned &&
              model.reassigned_tertiary_reviewers.includes(user))
          ) {
            return true;
          }
        }
        break;

      case UploadedModelStatusEnum.PENDING_APPROVAL:
        // only review managers can approve
        if (roles.includes(RolesEnum.REVIEWER_MANAGER.toString())) {
          return true;
        }
        break;

      case UploadedModelStatusEnum.APPROVED:
        // Anyone can view data on the map
        return true;
        break;

      default:
        break;
    }
  };

  const getActions = () => {
    const status = selectedModel?.status;
    let index = 1;
    let menuItems: any[] = [];
    if (!selectedModel) {
      return menuItems;
    }

    if (props.defaultMenu) {
      menuItems = menuItems.concat(props.defaultMenu);
    }
    const isActionValidated = validateAction(selectedModel.status);
    if (!isActionValidated) {
      return menuItems;
    }

    if (!props.inFormView) {
      menuItems = menuItems.concat(
        <MenuItem
          key={++index}
          onClick={async () => {
            setActionType(UploadedModelActionTypeEnum.VIEW_DETAILS);
            router.push({
              pathname: `/uploaded-model/${selectedModel?.id}`,
            });
          }}
        >
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {UploadedModelActionTypeEnum.VIEW_DETAILS}
          </ListItemText>
        </MenuItem>
      );
    }

    // if (status === UploadedModelStatusEnum.APPROVED) {
    //   menuItems = menuItems.concat(
    //     <MenuItem
    //       key={++index}
    //       onClick={async () => {
    //         setActionType(UploadedModelActionTypeEnum.VIEW_MAP);
    //         router.push({
    //           pathname: '/map',
    //         });
    //       }}
    //     >
    //       <ListItemIcon>
    //         <PlaceIcon fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>{UploadedModelActionTypeEnum.VIEW_MAP}</ListItemText>
    //     </MenuItem>
    //   );
    // }
    // if (status === UploadedModelStatusEnum.PENDING) {
    //   menuItems = menuItems.concat(
    //     <MenuItem
    //       key={++index}
    //       onClick={async () => {
    //         setActionType(UploadedModelActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS);
    //         setdialogOpen(true);
    //       }}
    //     >
    //       <ListItemIcon>
    //         <AssignmentIcon fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>
    //         {UploadedModelActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS}
    //       </ListItemText>
    //     </MenuItem>
    //   );
    // }
    // if (status === UploadedModelStatusEnum.PRIMARY_REVIEW) {
    //   if (!selectedModel.is_reupload_requested) {
    //     menuItems = menuItems.concat([
    //       <MenuItem
    //         key={++index}
    //         onClick={() => {
    //           setActionType(UploadedModelActionTypeEnum.REQUEST_REUPLOAD);
    //           setdialogOpen(true);
    //         }}
    //       >
    //         <ListItemIcon>
    //           <UploadIcon fontSize="small" />
    //         </ListItemIcon>
    //         <ListItemText>
    //           {UploadedModelActionTypeEnum.REQUEST_REUPLOAD}
    //         </ListItemText>
    //       </MenuItem>,
    //     ]);
    //   }

    //   menuItems = menuItems.concat([
    //     <MenuItem
    //       key={++index}
    //       onClick={() => {
    //         setActionType(UploadedModelActionTypeEnum.COMPLETE_PRIMARY_REVIEW);
    //         setdialogOpen(true);
    //       }}
    //     >
    //       <ListItemIcon>
    //         <UploadIcon fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>
    //         {UploadedModelActionTypeEnum.COMPLETE_PRIMARY_REVIEW}
    //       </ListItemText>
    //     </MenuItem>,

    //     <MenuItem
    //       key={++index}
    //       onClick={async () => {
    //         setActionType(UploadedModelActionTypeEnum.REJECT);
    //         setdialogOpen(true);
    //       }}
    //     >
    //       <ListItemIcon>
    //         <ClearIcon fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>{UploadedModelActionTypeEnum.REJECT}</ListItemText>
    //     </MenuItem>,

    //     <MenuItem
    //       key={++index}
    //       onClick={() => {
    //         setActionType(UploadedModelActionTypeEnum.SEND_EMAIL);
    //         setdialogOpen(true);
    //       }}
    //     >
    //       <ListItemIcon>
    //         <Mail fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>{UploadedModelActionTypeEnum.SEND_EMAIL}</ListItemText>
    //     </MenuItem>,
    //   ]);
    // }
    // if (status === UploadedModelStatusEnum.PENDING_ASSIGNING_TERTIARY_REVIEW) {
    //   menuItems = menuItems.concat(
    //     <MenuItem
    //       key={++index}
    //       onClick={async () => {
    //         setActionType(
    //           UploadedModelActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS
    //         );
    //         setdialogOpen(true);
    //       }}
    //     >
    //       <ListItemIcon>
    //         <AssignmentIcon fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>
    //         {UploadedModelActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS}
    //       </ListItemText>
    //     </MenuItem>
    //   );

    //   menuItems = menuItems.concat(
    //     <MenuItem
    //       key={++index}
    //       onClick={() => {
    //         setActionType(UploadedModelActionTypeEnum.SEND_EMAIL);
    //         setdialogOpen(true);
    //       }}
    //     >
    //       <ListItemIcon>
    //         <Mail fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>{UploadedModelActionTypeEnum.SEND_EMAIL}</ListItemText>
    //     </MenuItem>
    //   );
    // }
    // if (status === UploadedModelStatusEnum.TERTIARY_REVIEW) {
    //   menuItems = menuItems.concat([
    //     <MenuItem
    //       key={++index}
    //       onClick={() => {
    //         setActionType(UploadedModelActionTypeEnum.COMPLETE_TERTIARY_REVIEW);
    //         setdialogOpen(true);
    //       }}
    //     >
    //       <ListItemIcon>
    //         <UploadIcon fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>
    //         {UploadedModelActionTypeEnum.COMPLETE_TERTIARY_REVIEW}
    //       </ListItemText>
    //     </MenuItem>,

    //     <MenuItem
    //       key={++index}
    //       onClick={async () => {
    //         setActionType(UploadedModelActionTypeEnum.REJECT);
    //         setdialogOpen(true);
    //       }}
    //     >
    //       <ListItemIcon>
    //         <ClearIcon fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>{UploadedModelActionTypeEnum.REJECT}</ListItemText>
    //     </MenuItem>,
    //     <MenuItem
    //       key={++index}
    //       onClick={() => {
    //         setActionType(UploadedModelActionTypeEnum.SEND_EMAIL);
    //         setdialogOpen(true);
    //       }}
    //     >
    //       <ListItemIcon>
    //         <Mail fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>{UploadedModelActionTypeEnum.SEND_EMAIL}</ListItemText>
    //     </MenuItem>,
    //   ]);
    // }
    // if (status === UploadedModelStatusEnum.PENDING_APPROVAL) {
    //   if (
    //     roles.includes(RolesEnum.REVIEWER_MANAGER) ||
    //     roles.includes(RolesEnum.REVIEWER)
    //   ) {
    //     menuItems = menuItems.concat(
    //       <MenuItem
    //         key={++index}
    //         onClick={() => {
    //           setActionType(UploadedModelActionTypeEnum.VALIDATE);
    //           setdialogOpen(true);
    //         }}
    //       >
    //         <ListItemIcon>
    //           <RuleFolderIcon fontSize="small" />
    //         </ListItemIcon>
    //         <ListItemText>{UploadedModelActionTypeEnum.VALIDATE}</ListItemText>
    //       </MenuItem>
    //     );
    //   }
    //   if (roles.includes(RolesEnum.REVIEWER_MANAGER)) {
    //     menuItems = menuItems.concat(
    //       <MenuItem
    //         key={++index}
    //         onClick={() => {
    //           setActionType(
    //             UploadedModelActionTypeEnum.REASSIGN_TERTIARY_REVIEWERS
    //           );
    //           setdialogOpen(true);
    //         }}
    //       >
    //         <ListItemIcon>
    //           <CheckIcon fontSize="small" />
    //         </ListItemIcon>
    //         <ListItemText>
    //           {UploadedModelActionTypeEnum.REASSIGN_TERTIARY_REVIEWERS}
    //         </ListItemText>
    //       </MenuItem>
    //     );
    //     menuItems = menuItems.concat(
    //       <MenuItem
    //         key={++index}
    //         onClick={() => {
    //           setActionType(UploadedModelActionTypeEnum.APPROVE);
    //           setdialogOpen(true);
    //         }}
    //       >
    //         <ListItemIcon>
    //           <CheckIcon fontSize="small" />
    //         </ListItemIcon>
    //         <ListItemText>{UploadedModelActionTypeEnum.APPROVE}</ListItemText>
    //       </MenuItem>
    //     );
    //   }
    //   menuItems = menuItems.concat(
    //     <MenuItem
    //       key={++index}
    //       onClick={() => {
    //         setActionType(UploadedModelActionTypeEnum.SEND_EMAIL);
    //         setdialogOpen(true);
    //       }}
    //     >
    //       <ListItemIcon>
    //         <Mail fontSize="small" />
    //       </ListItemIcon>
    //       <ListItemText>{UploadedModelActionTypeEnum.SEND_EMAIL}</ListItemText>
    //     </MenuItem>
    //   );
    // }
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
      <UploadedModelActionDialog
        isOpen={dialogOpen}
        modelId={selectedModel?.id}
        action={actionType}
        onOk={() => {
          setActionType(UploadedModelActionTypeEnum.NONE);
          setdialogOpen(false);
          handleMenuClose();
        }}
        onCancel={() => {
          setActionType(UploadedModelActionTypeEnum.NONE);
          setdialogOpen(false);
          handleMenuClose();
        }}
      />
    </div>
  );
};
