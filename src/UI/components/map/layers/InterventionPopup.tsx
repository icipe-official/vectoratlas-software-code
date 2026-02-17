import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { toggleInterventionPopup } from '../../../state/map/mapSlice';

export default function IRPopup() {
  const dispatch = useDispatch();

  const open = useAppSelector(
    (state) => state.map.map_drawer.interventionPopupOpen
  );

  /** Decades shown for ALL interventions */
  const DECADES = ['90s', '00s', '10s'];

  /** Hard-coded mock data */
  const overlaysByIntervention: Record<
    string,
    Record<string, { id: string; title: string }[]>
  > = {
    PCR: {
      '90s': [{ id: 'pcr-90-1', title: 'PCR Testing Coverage' }],
      '00s': [{ id: 'pcr-00-1', title: 'PCR Scale-up' }],
      '10s': [{ id: 'pcr-10-1', title: 'PCR Nationwide Testing' }],
    },
    IRS: {
      '90s': [],
      '00s': [{ id: 'irs-00-1', title: 'IRS Pilot Areas' }],
      '10s': [{ id: 'irs-10-1', title: 'IRS National Coverage' }],
    },
    ITNs: {
      '90s': [],
      '00s': [],
      '10s': [{ id: 'itn-10-1', title: 'ITN Mass Distribution' }],
    },
  };

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(toggleInterventionPopup(false))}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Intervention Overlays</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ minHeight: 300 }}>
          <TreeView
            defaultExpandIcon={<ChevronRightIcon />}
            defaultCollapseIcon={<ExpandMoreIcon />}
          >
            {Object.entries(overlaysByIntervention).map(
              ([intervention, decadeData]) => (
                <TreeItem
                  key={intervention}
                  nodeId={intervention}
                  label={intervention}
                >
                  {DECADES.map((decade) => {
                    const overlays = decadeData[decade] ?? [];

                    return (
                      <TreeItem
                        key={`${intervention}-${decade}`}
                        nodeId={`${intervention}-${decade}`}
                        label={decade}
                      >
                        {overlays.length > 0 ? (
                          overlays.map((overlay) => (
                            <TreeItem
                              key={overlay.id}
                              nodeId={overlay.id}
                              label={overlay.title}
                            />
                          ))
                        ) : (
                          <TreeItem
                            nodeId={`${intervention}-${decade}-empty`}
                            label={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontStyle: 'italic' }}
                              >
                                No data available
                              </Typography>
                            }
                          />
                        )}
                      </TreeItem>
                    );
                  })}
                </TreeItem>
              )
            )}
          </TreeView>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => dispatch(toggleInterventionPopup(false))}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
