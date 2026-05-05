import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import React, { useCallback, useEffect, useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
  Container,
  Link,
  Typography,
  Badge,
  Tooltip,
  ButtonGroup,
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useRouter } from 'next/router';
import { StatusRenderer } from '../shared/statusRenderer';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  getUploadedModels,
  getUploadedModel,
} from '../../state/uploadedModel/actions/uploaded-model.action';
import AddIcon from '@mui/icons-material/Add';
// import AssignReviewerDialog from './AssignReviewerDialog';
import { fetchAllUsers } from '../../api/api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import UploadIcon from '@mui/icons-material/Upload';
import ClearIcon from '@mui/icons-material/Clear';
import AssignmentIcon from '@mui/icons-material/Assignment';
// import RejectDialog from './RejectDialog';
import EmailPopup from '../sendMail/sendMail';
import { Mail } from '@mui/icons-material';
// import { UploadedModelActionDialog } from './UploadedModelActionDialog';
import {
  RolesEnum,
  // UploadedModel,
  UploadedModelActionTypeEnum,
  UploadedModelStatusEnum,
} from '../../state/state.types';
// import { UploadedModelActionMenu } from './UploadedModelActionMenu';
import {
  setCurrentUploadedModel,
  UploadedModel,
} from '../../state/uploadedModel/uploadedModelSlice';
import DateRenderer from '../shared/dateRenderer';
import { formatDate } from '../../utils/utils';
import { getUserInfo } from '../../state/auth/actions/getUserInfo';
import AuthWrapper from '../shared/AuthWrapper';
import { useTranslations } from 'next-intl';

interface FilterState {
  assignedToMe: boolean;
  pendingAssignment: boolean;
  pendingApproval: boolean;
}
interface EditToolbarProps {
  // setRows: (newRows: )
}

interface IUser {
  auth0_id: string;
  is_uploader: boolean;
  is_reviewer: boolean;
  is_admin: boolean;
  is_editor: boolean;
  is_reviewer_manager: boolean | null;
  is_model_manager: boolean | null;
  disable_notifications: boolean;
}

export const UploadedModelList = () => {
  function AddToolbar(props: EditToolbarProps) {
    const handleCheckboxChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setState({
        ...state,
        [event.target.name]: event.target.checked,
      });
    };

    const { assignedToMe, pendingAssignment, pendingApproval } = state;
    const t = useTranslations('UploadedModelListPage');

    return (
      <GridToolbarContainer
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#fefaf8',
          padding: 0,
        }}
      >
        {user.roles.includes(RolesEnum.MODEL_MANAGER) && (
          <Button
            color="primary"
            startIcon={<AddIcon />}
            // onClick={handleUploadModel}
            href="/model_upload"
          >
            {t('toolbar.uploadNewModel')}
          </Button>
        )}
      </GridToolbarContainer>
    );
  }

  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [validateActionDialogOpen, setValidateActionDialogOpen] =
    useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [assignmentType, setAssignmentType] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For menu handling
  const [selectedRow, setSelectedRow] = useState<any>(null); // Track the selected row
  const [rejectDialogOpen, setRejectDialogOpen] = useState<any>(null);
  const [rejectType, setRejectType] = useState<string>('');
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const router = useRouter();
  const [filteredModels, setFilteredModels] = useState<UploadedModel[]>([]);

  const t = useTranslations('UploadedModelListPage');

  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.uploadedModel.loading);
  const selectedModel = useAppSelector(
    (state) => state.uploadedModel.currentUploadedModel
  );
  const uploadedModels = useAppSelector(
    (state) => state.uploadedModel.uploadedModels
  );

  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth);
  const [state, setState] = useState<FilterState>({
    assignedToMe:
      user.roles.includes(RolesEnum.REVIEWER) &&
      !user.roles.includes(RolesEnum.REVIEWER_MANAGER),
    pendingAssignment: user.roles.includes(RolesEnum.REVIEWER_MANAGER),
    pendingApproval: user.roles.includes(RolesEnum.REVIEWER_MANAGER),
  });

  const loadModels = useCallback(async () => {
    await dispatch(getUploadedModels());
  }, [dispatch]);

  const selectModel = async (id: string) => {
    await dispatch(getUploadedModel(id));
  };

  const loadUsers = async () => {
    const res: any[] = await fetchAllUsers();
    setUsers(res);
  };

  // const columns: GridColDef<typeof rows[number]>[] = [

  const handleOpenPopup = () => {
    setIsEmailPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsEmailPopupOpen(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row); // Set the selected row
    setSelectedModelId(row.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleModelReject = () => {
    setRejectDialogOpen(true);
  };

  const handleDialogClose = () => {
    setActionDialogOpen(false);
    loadModels();
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    loadModels();
  };

  const columns = [
    {
      field: 'title',
      headerName: t('grid.title'),
      width: 300,
      renderCell: (params: GridRenderCellParams<any, any>) => {
        if (params.row.is_reupload_requested && !params.row.is_reuploaded) {
          return (
            <Tooltip title={t('pendingReupload')}>
              <Badge color="secondary" variant="dot">
                <div>{params.value}</div>
                {/* <Link
                  onClick={() => {
                    router.push({
                      pathname: `/uploaded-model/${params.row.id}`,
                    });
                  }}
                >
                  {params.value}
                </Link> */}
              </Badge>
            </Tooltip>
          );
        }
        return (
          <div>{params.value}</div>
          // <Link
          //   onClick={() => {
          //     router.push({
          //       pathname: `/uploaded-model/${params.row.id}`,
          //     });
          //   }}
          // >
          //   {params.value}
          // </Link>
        );
      },
      valueGetter: (params: any) => {
        return (
          <Link href={`/uploaded-model/${params.row.id}`}>
            {params.row.title}
          </Link>
        );
      },
    },
    {
      field: 'description',
      headerName: t('grid.description'),
      type: 'string',
      width: 250,
    },
    // {
    //   field: 'source_country',
    //   headerName: 'Uploader Country',
    //   type: 'string',
    //   width: 180,
    // },
    {
      field: 'status',
      headerName: 'Approval Status',
      type: 'string',
      width: 180,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <StatusRenderer status={params.value} statusTitle={params.value} />
      ),
    },
    {
      field: 'last_upload_date',
      headerName: t('grid.uploadedOn'),
      type: 'dateTime',
      width: 200,
      valueGetter: (params: any) => new Date(params.row.last_upload_date),
      renderCell: ({ row }: { row: any }) => (
        <DateRenderer value={row.last_upload_date} />
      ),
    },
    {
      field: 'actions',
      headerName: t('grid.actions'),
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <IconButton onClick={(event) => handleMenuClick(event, params.row)}>
              <MoreVertIcon />
            </IconButton>
            {/* <UploadedModelActionMenu
              inFormView={false}
              status="Pending"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            /> */}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    loadModels();
  }, [loadModels, token]);

  useEffect(() => {
    if (selectedModelId) {
      dispatch(getUploadedModel(selectedModelId));
    } else {
      dispatch(setCurrentUploadedModel(null));
    }
  }, [dispatch, selectedModelId]);

  // useEffect(() => {
  //   // setFilteredModels([...uploadedModels]);
  // }, [uploadedModels]);

  useEffect(() => {
    const filtered = uploadedModels?.filter((el) => {
      if (
        state.assignedToMe &&
        state.pendingAssignment &&
        state.pendingApproval
      ) {
        if (
          (el.primary_reviewers.includes(user.id) ||
            (!el.is_tertiary_review_reassigned &&
              el.tertiary_reviewers.includes(user.id)) ||
            (el.is_tertiary_review_reassigned &&
              el.reassigned_tertiary_reviewers.includes(user.id))) &&
          (el.status == UploadedModelStatusEnum.PENDING ||
            el.status ==
              UploadedModelStatusEnum.PENDING_ASSIGNING_TERTIARY_REVIEW ||
            el.status == UploadedModelStatusEnum.PENDING_APPROVAL)
        ) {
          return true;
        }
      } else if (state.assignedToMe) {
        return (
          el.primary_reviewers.includes(user.id) ||
          (!el.is_tertiary_review_reassigned &&
            el.tertiary_reviewers.includes(user.id)) ||
          (el.is_tertiary_review_reassigned &&
            el.reassigned_tertiary_reviewers.includes(user.id))
        );
      } else if (state.pendingAssignment) {
        return (
          el.status == UploadedModelStatusEnum.PENDING ||
          el.status == UploadedModelStatusEnum.PENDING_ASSIGNING_TERTIARY_REVIEW
        );
      } else if (state.pendingApproval) {
        return el.status == UploadedModelStatusEnum.PENDING_APPROVAL;
      }
      if (
        !state.assignedToMe &&
        !state.pendingAssignment &&
        !state.pendingApproval
      ) {
        return true;
      }
      return false;
    });
    setFilteredModels(filtered ? [...filtered] : []);
  }, [state, uploadedModels, user.id]);

  return (
    <div style={{ width: '100%' }}>
      <main>
        <Typography variant="h5">{t('title')}</Typography>
        <>
          <DataGrid
            rows={/*filteredModels*/ uploadedModels}
            columns={columns}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            slots={{
              toolbar: AddToolbar,
            }}
          />
          {selectedModel && (
            <>
              {/* Render AssignReviewerDialog only when actionDialogOpen is true */}
              {/* {actionDialogOpen && (
                <AssignReviewerDialog
                  open={actionDialogOpen}
                  onClose={handleDialogClose}
                  modelId={selectedModel.id}
                  assignmentType={assignmentType}
                />
              )} */}

              {/* Render RejectDialog only when rejectDialogOpen is true */}
              {/* {rejectDialogOpen && (
                <RejectDialog
                  open={rejectDialogOpen}
                  onClose={handleCloseRejectDialog}
                  modelId={selectedModel.id}
                  rejectType={rejectType}
                />
              )} */}
            </>
          )}
          {isEmailPopupOpen && (
            <EmailPopup isOpen={isEmailPopupOpen} onClose={handleClosePopup} />
          )}
          {loading && <CircularProgress />}
        </>
      </main>
      {/* <UploadedModelActionDialog
        isOpen={validateActionDialogOpen}
        modelId={''}
        action={UploadedModelActionTypeEnum.ADHOC_VALIDATE}
        onOk={() => {
          // setActionType('');
          setValidateActionDialogOpen(false);
          // handleMenuClose();
        }}
        onCancel={() => {
          // setActionType('');
          setValidateActionDialogOpen(false);
          // handleMenuClose();
        }}
      /> */}
    </div>
  );
};
