import React, { useEffect, useRef, useState } from 'react';
import {
  capitalizeFirstLetter,
  getAllNestedKeys,
  getNestedObjectValue,
  splitByCapitalLetter,
} from '../../utils/utils';
import {
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import MessagesFr from '../../public/messages/fr.json';
import MessagesPt from '../../public/messages/pt.json';
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridPaginationModel,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import _ from 'lodash';
import {
  SUPPORTED_LANGUAGES,
  TranslationMessage,
} from '../../utils/localization';
import { useTranslations } from 'next-intl';
import { StatusRenderer } from '../shared/statusRenderer';
import { toast } from 'react-toastify';

interface Props {
  labels: any;
}

// English is shown as its own column, placed between French and Portuguese
const ENGLISH_LANGUAGE = { code: 'en', name: 'English', emoji: '🇬🇧' };

const PAGE_SIZE_OPTIONS = [10, 25, 50];

// Phone-only sizing. Raise the numbers to enlarge, lower them to squeeze.
const COMPACT = {
  cellFontSize: '0.875rem',
  cellPaddingY: 0.75,
  cellPaddingX: 1,
  headerFontSize: '0.875rem',
  chipHeight: 28,
  chipFontSize: '0.6875rem',
  chipGap: 1,
  bannerFontSize: '0.8125rem',
  pathWidth: 140,
  languageMinWidth: 160,
};

export default function TranslationForm({ labels }: Props) {
  const t = useTranslations('TranslationsPage');

  const [topLevelParents, setTopLevelParents] = useState<string[]>([]);
  const [parent, setParent] = useState('');
  const [messages, setMessages] = useState<TranslationMessage[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [mobileLang, setMobileLang] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [gridWidth, setGridWidth] = useState(0);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const gridRef = useGridApiRef();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Phone-width check (matches MUI's sm breakpoint)
  const isMobile = useMediaQuery('(max-width:599.95px)');

  // Language order: French, English, then Portuguese
  const orderedLanguages = [
    ...SUPPORTED_LANGUAGES.filter((el) => el.code !== 'pt' && el.code !== 'en'),
    ENGLISH_LANGUAGE,
    ...SUPPORTED_LANGUAGES.filter((el) => el.code === 'pt'),
  ];

  // On phones, only one language column is shown at a time.
  // Falls back to the first language if none has been chosen yet.
  const activeMobileLang = mobileLang || orderedLanguages[0]?.code;

  // Measure the grid's visible width, so on phones the language column fills
  // exactly the space left after the Path column (a few px reserved for borders)
  useEffect(() => {
    const el = gridContainerRef.current;
    if (!el) return;
    const update = () => setGridWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, parent]);

  const mobileLanguageWidth = Math.max(
    COMPACT.languageMinWidth,
    gridWidth - COMPACT.pathWidth - 4
  );

  const languageColumns = (
    isMobile
      ? orderedLanguages.filter((el) => el.code === activeMobileLang)
      : orderedLanguages
  ).map((el) => ({
    field: el.code,
    headerName: el.name,
    type: 'string' as const,
    // Phones: fixed width measured from the screen. Desktop: share the space.
    ...(isMobile ? { width: mobileLanguageWidth } : { flex: 1, minWidth: 200 }),
    editable: true,
    sortable: false,
    // Own wrapping box, so long translations break onto new lines
    // inside the cell instead of running past its right edge
    renderCell: (params: GridRenderCellParams<any, any>) => (
      <div
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
          width: '100%',
          lineHeight: 1.4,
        }}
      >
        {params.value}
      </div>
    ),
    renderHeader: (params: GridColumnHeaderParams) => (
      <strong>
        {el.name}{' '}
        <span role="img" aria-label="flag">
          {el.emoji}
        </span>
      </strong>
    ),
  }));

  // Sr column is hidden on phones to leave room for the language
  const srColumn: GridColDef = {
    field: 'id',
    headerName: t('grid.sr'),
    width: 50,
    editable: false,
    sortable: false,
    renderCell: (params: GridRenderCellParams<any, any>) => {
      const idx =
        params.api.getRowIndexRelativeToVisibleRows(params.row?.id) || 0;
      return <div>{idx + 1}</div>;
    },
  };

  const pathColumn: GridColDef = {
    field: 'path',
    headerName: t('grid.path'),
    // Narrow fixed width: labels wrap onto more lines instead of taking space
    width: isMobile ? COMPACT.pathWidth : 170,
    editable: false,
    sortable: false,
    renderCell: (params: GridRenderCellParams<any, any>) => {
      const val = formatMessagePath(params.value, false);
      return (
        <div
          style={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            width: '100%',
          }}
        >
          {val}
        </div>
      );
    },
  };

  const columns: GridColDef[] = [
    ...(isMobile ? [] : [srColumn]),
    pathColumn,
    ...languageColumns,
  ];

  const formatMessagePath = (path: string, ignoreTopMostParent = true) => {
    let vals = path?.split('.');
    let tempRes: string[] = [];
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
    // Start each newly chosen page at the first page of results
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const saveMessages = async () => {
    setIsSaving(true);
    try {
      // getAllRowIds returns every row, not just the current page,
      // so saving includes all translations
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
              label: splitByCapitalLetter(key),
              en: data[key],
              fr: getNestedObjectValue(MessagesFr, path),
              pt: getNestedObjectValue(MessagesPt, path),
            });
          }
        }
      }
    }
    return items;
  }

  const resetMessages = () => {
    loadMessages();
  };

  // Grid styling: wrapping on all sizes, phone-only sizes from COMPACT
  const gridSx = {
    '& .MuiDataGrid-cell': {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
      lineHeight: 1.4,
      ...(isMobile
        ? {
            fontSize: COMPACT.cellFontSize,
            py: COMPACT.cellPaddingY,
            px: COMPACT.cellPaddingX,
          }
        : {}),
    },
    '& .MuiDataGrid-cellContent': {
      whiteSpace: 'normal',
      maxWidth: '100%',
    },
    '& .MuiDataGrid-columnHeader': isMobile ? { px: COMPACT.cellPaddingX } : {},
    '& .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-columnHeaderTitleContainer strong':
      isMobile ? { fontSize: COMPACT.headerFontSize } : {},
  };

  return (
    <div>
      {/* TOOLBAR: wraps on phones so the buttons never squeeze together */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          alignItems: 'center',
          gap: 1.5,
          mb: 1,
        }}
      >
        {isDirty && (
          <StatusRenderer status="Pending" statusTitle={t('notSaved')} />
        )}

        <Stack spacing={1.5} direction="row" sx={{ flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="secondary"
            size={isMobile ? 'small' : 'medium'}
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
            size={isMobile ? 'small' : 'medium'}
            onClick={() => {
              setShowSaveConfirm(true);
            }}
          >
            {t('buttons.save')}
          </Button>
        </Stack>
      </Box>

      {/* PAGE SELECT: full width on phones */}
      <Box sx={{ mb: isMobile ? 0.5 : 1 }}>
        <FormLabel>
          <span style={{ marginRight: 10 }}>{t('selectPage')}</span>
        </FormLabel>
        <Select
          value={parent}
          onChange={handleChange}
          size={isMobile ? 'small' : 'medium'}
          sx={{ width: { xs: '100%', sm: '50%' }, mt: 0.5 }}
        >
          {topLevelParents.map((el) => (
            <MenuItem key={el} value={el} style={getStyles(el, theme)}>
              {splitByCapitalLetter(el)}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Typography
        variant="body2"
        color="error"
        sx={{
          mb: isMobile ? 1 : 2,
          textAlign: 'center',
          fontSize: isMobile ? COMPACT.bannerFontSize : undefined,
        }}
      >
        {t('bannerMessage')}
      </Typography>

      {/* PHONE: language chips on one line. Each chip shares the row width
          and shrinks its text with an ellipsis if needed */}
      {isMobile && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: 0.5,
            mb: 1,
          }}
        >
          {orderedLanguages.map((el) => {
            const selected = el.code === activeMobileLang;
            return (
              <Chip
                key={el.code}
                size="small"
                label={`${el.emoji} ${el.name}`}
                onClick={() => setMobileLang(el.code)}
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                sx={{
                  flex: '1 1 0',
                  minWidth: 0,
                  height: COMPACT.chipHeight,
                  fontSize: COMPACT.chipFontSize,
                  fontWeight: selected ? 600 : 400,
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    px: 0.25,
                  },
                }}
              />
            );
          })}
        </Box>
      )}

      {/* PHONE: prompt until a page is chosen, so the grid isn't an empty box */}
      {isMobile && !parent && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 3 }}
        >
          Choose a page above to start editing.
        </Typography>
      )}

      {/* GRID: all columns on desktop, Path plus one language on phones.
          Paginated on both, so only one page of rows is rendered at a time */}
      {(!isMobile || parent) && (
        <Box
          ref={gridContainerRef}
          sx={{ width: '100%', minWidth: 0, overflowX: 'auto' }}
        >
          <DataGrid
            editMode="row"
            rows={messages}
            columns={columns}
            apiRef={gridRef}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            disableColumnMenu={false}
            autoHeight
            getRowHeight={() => 'auto'}
            density="compact"
            sx={gridSx}
            processRowUpdate={(updatedRow, originalRow) => {
              setIsDirty(!_.isEqual(updatedRow || {}, originalRow || {}));
              return updatedRow;
            }}
            onProcessRowUpdateError={(error: any) => {
              console.log('Value update error: ', error);
            }}
          />
        </Box>
      )}

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
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
