import React, { useEffect, useRef, useState } from 'react';
import {
  capitalizeFirstLetter,
  getAllNestedKeys,
  getNestedObjectValue,
  splitByCapitalLetter,
} from '../../utils/utils';
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Theme,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';

import MessagesEn from '../../messages/en.json';
import MessagesFr from '../../messages/fr.json';
import MessagesPt from '../../messages/pt.json';
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import _ from 'lodash';
import {
  LANGUAGE_CODE,
  SUPPORTED_LANGUAGES,
  TranslationMessage,
} from '../../utils/localization';
import { useTranslations } from 'next-intl';
import { StatusRenderer } from '../shared/statusRenderer';
import { toast } from 'react-toastify';

interface Props {
  labels: any;
}

export default function TranslationForm({ labels }: Props) {
  const t = useTranslations('TranslationsPage');

  const [labelsObject, setLabelsObject] = useState(labels);
  const [keys, setKeys] = useState([]);
  const [topLevelParents, setTopLevelParents] = useState<string[]>([]);
  const [parent, setParent] = useState('');
  const [messages, setMessages] = useState<TranslationMessage[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const theme = useTheme();
  const gridRef = useGridApiRef(); // useRef()
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const frozenColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('grid.sr'),
      width: 20,
      editable: false,
      pinnable: true,
      sortable: false, // disable sorting to ensure keys are not re-arranged
      renderCell: (params: GridRenderCellParams<any, any>) => {
        let idx =
          params.api.getRowIndexRelativeToVisibleRows(params.row?.id) || 0;
        return <div>{idx + 1}</div>;
      },
      renderHeader: (params: GridColumnHeaderParams) => (
        <strong>{t('grid.sr')}</strong>
      ),
    },
    {
      field: 'path',
      headerName: t('grid.path'),
      width: 600,
      // flex: 1,
      editable: false,
      pinnable: true,
      sortable: false, // disable sorting to ensure keys are not re-arranged
      renderCell: (params: GridRenderCellParams<any, any>) => {
        // let vals = params.value?.split('.');
        // let val = vals.slice(1).join(' -> ');
        const val = formatMessagePath(params.value, false);
        return <div>{val}</div>;
      },
      renderHeader: (params: GridColumnHeaderParams) => (
        <strong>
          {t('grid.path')}
          {'  '}
          <span role="img" aria-label="enjoy">
            📂
          </span>
        </strong>
      ),
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '',
      width: 1,
      editable: false,
      hideable: true,
      sortable: false, // disable sorting to ensure keys are not re-arranged
      renderCell: (params: GridRenderCellParams<any, any>) => {
        let vals = params.value?.split('.');
        let val = vals.slice(1).join(' -> ');
        // return <div>{val}</div>;
        return <div></div>;
      },
    },
  ];

  SUPPORTED_LANGUAGES.map((el) => {
    columns.push({
      field: el.code,
      headerName: el.name,
      type: 'string',
      width: 300,
      hideable: true,
      editable: true, //el.code != 'en', // allow even editing of English one
      sortable: false, // disable sorting to ensure keys are not re-arranged
      renderHeader: (params: GridColumnHeaderParams) => (
        <strong>
          {el.name}{' '}
          <span role="img" aria-label="enjoy">
            {el.emoji}
          </span>
        </strong>
      ),
    });
  });

  const formatMessagePath = (path: string, ignoreTopMostParent = true) => {
    let vals = path?.split('.');
    let tempRes: string[] = [];
    // for each of the values, split by Capital Letter
    vals.forEach((el, index) => {
      if (ignoreTopMostParent && index == 0) {
        // do nothing since we are skipping the top most parent
      } else {
        const splitText = splitByCapitalLetter(el);
        tempRes.push(capitalizeFirstLetter(splitText));
      }
    });
    return tempRes.slice(1).join(' -> ');
  };

  useEffect(() => {
    setLabelsObject(labels);
    const allKeys = getAllNestedKeys(labels);
    const parents = Object.keys(labels);
    setTopLevelParents(parents || []);
  }, [labels]);

  useEffect(() => {
    loadMessages();
  }, [parent]);

  const loadMessages = () => {
    const res = extractTranslations(parent, labels[parent]);
    setMessages(res);
    setIsDirty(false);
  };

  const saveMessages = async () => {
    setIsSaving(true);
    try {
      const rowIds = gridRef.current.getAllRowIds();
      const rows: TranslationMessage[] = [];
      rowIds.map((id) => {
        const el = gridRef.current.getRow(id) as TranslationMessage;
        rows.push(el);
      });
      await saveTranslations(rows);
      setIsDirty(false);
      setIsSaving(false);
      toast.success(t('saveSuccess'));
    } catch (error) {
      toast.error(t('saveFailure'));
      console.error(error);
      setIsSaving(false);
    }
  };

  const saveTranslations = async (messagesJson: object) => {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messagesJson,
        parent: parent,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    setParent(event.target.value);
  };

  function getStyles(lang: string, theme: Theme) {
    return {
      fontWeight:
        parent === lang
          ? theme.typography.fontWeightMedium
          : theme.typography.fontWeightRegular,
    };
  }

  function extractTranslations(parentPath: string, data: any, indent = 0) {
    let items: TranslationMessage[] = [];
    if (Array.isArray(data)) {
      data.forEach((item) => {
        const subItems = extractTranslations(`${parentPath}`, item, indent + 1);
        if (subItems.length > 0) {
          items = [...items, ...subItems];
        }
      });
    } else if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const path = `${parentPath}.${key}`;

          if (typeof data[key] === 'object') {
            const subItems = extractTranslations(path, data[key], indent + 1);
            if (subItems.length > 0) {
              items = [...items, ...subItems];
            }
          } else {
            items.push({
              id: path,
              path: path,
              //key: key,
              label: splitByCapitalLetter(key),
              en: data[key],
              fr: getNestedObjectValue(MessagesFr, path),
              pt: getNestedObjectValue(MessagesPt, path),
            });
          }
        }
      }
    } else {
      // Handle primitive types (string, number, boolean, null)
    }
    return items;
  }

  function renderJsonToHtml(data: any, indent = 0) {
    let html = '';
    const indentSpace = '  '.repeat(indent); // For visual indentation

    if (Array.isArray(data)) {
      html += `${indentSpace}<ul>\n`;
      data.forEach((item) => {
        html += `${indentSpace}  <li>\n`;
        html += renderJsonToHtml(item, indent + 1);
        html += `${indentSpace}  </li>\n`;
      });
      html += `${indentSpace}</ul>\n`;
    } else if (typeof data === 'object' && data !== null) {
      html += `${indentSpace}<div>\n`;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          html += `${indentSpace}  <strong>${key}:</strong>\n`;
          html += renderJsonToHtml(data[key], indent + 1);
        }
      }
      html += `${indentSpace}</div>\n`;
    } else {
      // Handle primitive types (string, number, boolean, null)
      html += `${indentSpace}<span>${data}</span>\n`;
    }
    return html;
  }

  const resetMessages = () => {
    loadMessages();
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: 5,
        }}
      >
        {isDirty && (
          <StatusRenderer status="Pending" statusTitle={t('notSaved')} />
        )}

        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              if (isDirty) {
                setShowResetConfirm(true);
              }
            }}
          >
            {t('buttons.reset')}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowSaveConfirm(true);
            }}
            // disabled={!isDirty}
          >
            {t('buttons.save')}
          </Button>
        </Stack>
      </div>

      <div
        style={{
          flex: 1,
          // justifyItems: 'center',
          // gap: 10,
          // alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <FormLabel key={'2'}>
          <span style={{ marginRight: 10 }}>{t('selectPage')}</span>
        </FormLabel>
        <Select
          sx={{ width: '50%' }}
          value={parent}
          onChange={handleChange}
          style={{ border: 0, marginBottom: 10 }}
          //MenuProps={MenuProps}
        >
          {topLevelParents.map((el) => (
            <MenuItem key={el} value={el} style={getStyles(el, theme)}>
              {splitByCapitalLetter(el)}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Typography
        variant="body2"
        color="error"
        style={{ marginBottom: 10, textAlign: 'center' }}
      >
        {t('bannerMessage')}
      </Typography>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyItems: 'flex-start',
        }}
      >
        <div style={{ width: '30%' }}>
          <DataGrid
            editMode="cell"
            rows={messages}
            columns={frozenColumns}
            // apiRef={gridRef}
            // style={{ width: 1000 }}
            hideFooter={true}
          />
        </div>
        <div style={{ width: '70%' }}>
          <DataGrid
            editMode="row"
            rows={messages}
            columns={columns}
            apiRef={gridRef}
            hideFooter={true}
            disableColumnMenu={false}
            // columnVisibilityModel={{
            //   // hide column id
            //   id: false,
            // }}
            processRowUpdate={(updatedRow, originalRow) => {
              setIsDirty(!_.isEqual(updatedRow || {}, originalRow || {}));
              return updatedRow;
            }}
            onProcessRowUpdateError={(error: any) => {
              console.log('Value update error: ', error);
            }}
          />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showResetConfirm}
        title={t('confirmResetTitle')}
        message={t('confirmResetMessage')}
        onConfirm={resetMessages}
        onCancel={() => setShowResetConfirm(false)}
      />

      <ConfirmationDialog
        isOpen={showSaveConfirm}
        title={t('confirmSaveTitle')}
        message={t('confirmSaveMessage')}
        onConfirm={saveMessages}
        onCancel={() => setShowSaveConfirm(false)}
      />

      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isSaving}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
