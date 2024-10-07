import React, { useCallback, useEffect, useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import {
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  LexicalCommand,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from 'lexical';
import { $wrapNodes } from '@lexical/selection';
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import TitleIcon from '@mui/icons-material/Title'; // Add icon for headings

const LowPriority = 1;

const ModifiedToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState('paragraph');
  const [formats, setFormats] = useState<string[]>([]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        const type = parentList ? parentList.getTag() : element.getTag();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        if (type !== 'root') {
          setBlockType(type);
        }
      }

      // Update text format
      const formats = [];
      if (selection.hasFormat('bold')) {
        formats.push('bold');
      }
      if (selection.hasFormat('italic')) {
        formats.push('italic');
      }
      if (selection.hasFormat('underline')) {
        formats.push('underline');
      }
      setFormats(formats);
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const toggleBlockType = (type: string) => {
    setBlockType(type);

    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        if (type === 'ul') {
          if (blockType !== 'ul') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        }
        if (type === 'ol') {
          if (blockType !== 'ol') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        } else {
          $wrapNodes(selection, () =>
            $createHeadingNode(type as HeadingTagType)
          );
        }
      }
    });
  };

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
  };

  const toggleFormat = (format: TextFormatType) => () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <Toolbar variant="dense" disableGutters>
      <ToggleButtonGroup
        value={blockType}
        exclusive
        onChange={(_, newType) => {
          if (newType) {
            toggleBlockType(newType);
          }
        }}
        aria-label="block types"
        size="small"
      >
        <ToggleButton value="paragraph" aria-label="Normal">
          Normal
        </ToggleButton>
        <ToggleButton value="h1" aria-label="Large heading">
          <TitleIcon fontSize="large" />
        </ToggleButton>
        <ToggleButton value="h2" aria-label="Small heading">
          <TitleIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value="ul" aria-label="Bullet list">
          Bullet List
        </ToggleButton>
        <ToggleButton value="ol" aria-label="Numbered list">
          Numbered List
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        value={formats}
        onChange={handleFormat}
        aria-label="text formatting"
        size="small"
      >
        <ToggleButton
          value="bold"
          aria-label="bold"
          onClick={toggleFormat('bold')}
        >
          <FormatBoldIcon />
        </ToggleButton>
        <ToggleButton
          value="italic"
          aria-label="italic"
          onClick={toggleFormat('italic')}
        >
          <FormatItalicIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Toolbar>
  );
};

export default ModifiedToolbarPlugin;
