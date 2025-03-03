import React, { useCallback, useEffect, useState } from 'react';
import { MatchColumns } from './components/MatchColumns';
import { Box, Typography } from '@mui/material';
import {
  ERROR_COLUMN_NAME,
  ID_COLUMN_NAME,
  ImportStepProps,
  SourceToTargetKeyMap,
} from '../../types';
import { NavigationPanel } from '../../components/NavigationPanel';
import { toast } from 'react-toastify';
import { renameObjectKeys } from '../../utils';
import { useSpreadsheetImporter } from '../../hooks/useSpreadsheetImporter';
import { StepType } from '../../ImportWizard';
import { stat } from 'fs';

interface Props extends ImportStepProps {
  autoMapDistance: number;
  autoMapHeaders: boolean;
}

export const MatchColumnsStep = ({
  state,
  onContinue,
  onBack,
  onSkip,
  autoMapHeaders,
  autoMapDistance,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const { optionalSteps, targetFields } = useSpreadsheetImporter();
  const isOptional = optionalSteps.includes(StepType.matchColumns);

  const getMappedTargets = useCallback(() => {
    let targets = state.columnMap
      .map((el) => el.target)
      .filter((el) => el != undefined && el !== '');
    return targets;
  }, [state.columnMap]);

  const getMatchingIndices = useCallback(
    (target: string, zeroBased: boolean = true) => {
      const indexesFromSearch: number[] = [];

      const validColumns = state.rawColumns.filter((el) => el);
      const nonEmptyColumnMapAfterMatch = state.columnMap.filter(
        (el) => el.source
      );

      nonEmptyColumnMapAfterMatch.forEach((e, index) => {
        const origIndex = validColumns.findIndex((el) => el == e.source);
        //nonEmpty[index].target === target &&
        // indexesFromSearch.push(zeroBased ? index : index + 1);
        nonEmptyColumnMapAfterMatch[index].target === target &&
          indexesFromSearch.push(zeroBased ? origIndex : origIndex + 1);
        return indexesFromSearch;
      });

      return indexesFromSearch;
    },
    [state.columnMap, state.rawColumns]
  );

  const validateStep = useCallback(() => {
    const validateDuplicateTargets = () => {
      // check no duplicate target columns
      const targets = getMappedTargets();
      let duplicates = targets.filter(
        (item, index) => targets.indexOf(item) !== index
      );
      if (duplicates.length > 0 && duplicates[0]) {
        const indices = getMatchingIndices(duplicates[0], false);
        toast.error(
          `Target column [${duplicates[0]}] has more than one match in rows [${indices}]. A target column can only be matched once`
        );
        return false;
      }
      return true;
    };

    const validateMandatoryColumns = () => {
      const requiredFields = targetFields.filter((el) => el.required);
      const mappedTargets = getMappedTargets();
      for (const field of requiredFields) {
        if (!mappedTargets.includes(field.key)) {
          toast.error(`Mandatory field [${field.label}] has not been mapped`);
          return false;
        }
      }
      return true;
    };

    let res = validateDuplicateTargets();
    if (res) {
      res = validateMandatoryColumns();
    }
    return res;
  }, [getMappedTargets, getMatchingIndices, targetFields]);

  const transformData = useCallback(() => {
    const destData = [];
    const keyMappings: SourceToTargetKeyMap[] = [];
    state.headers = [];
    state.columnMap.map((cm) => {
      if (cm.target) {
        keyMappings.push({ oldKey: cm.source, newKey: cm.target });
        state.headers.push(cm.target);
      }
    });
    state.transformedData = [];
    state.rawRecords.map((rec, idx) => {
      const obj = renameObjectKeys(rec, keyMappings, false);
      state.transformedData.push({
        ...obj,
        [ID_COLUMN_NAME]: idx + 1,
        [ERROR_COLUMN_NAME]: '{}',
      });
    });
  }, [state]);

  const handleOnContinue = useCallback(async () => {
    setLoading(true);
    if (!validateStep()) {
      setLoading(false);
      return;
    }
    try {
      transformData();
      await onContinue(state);
    } catch (error) {}
    setLoading(false);
  }, [onContinue, state, transformData, validateStep]);

  useEffect(() => {
    state.activeStep = StepType.matchColumns;
    // state.columnMap = state.columnMap.map((el) => {
    //   return { ...el, target: '' };
    // });
  }, [state]);

  return (
    <>
      <Box
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyItems: 'center',
          flexDirection: 'column',
          marginTop: 10,
        }}
      >
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          Match Columns
        </Typography>
        <MatchColumns
          state={state}
          autoMapDistance={autoMapDistance}
          autoMapHeaders={autoMapHeaders}
          onLoadMatchComplete={() =>
            state.rawColumns?.length > 0 ? setLoading(false) : undefined
          }
        />
      </Box>
      <NavigationPanel
        onNext={() => handleOnContinue()}
        onPrev={onBack}
        onSkip={onSkip}
        isLoading={loading}
        isOptional={isOptional}
      />
    </>
  );
};
