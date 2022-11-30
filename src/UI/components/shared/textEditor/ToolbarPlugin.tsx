import React, { useCallback, useEffect, useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  FormControl,
  MenuItem,
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

const LowPriority = 1;

const EditorToolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState('paragraph');
  const [formats, setFormats] = React.useState<string[]>([]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
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

  const handleBlockTypeChange = (e: SelectChangeEvent<string>) => {
    setBlockType(e.target.value);

    // if (e.target.value === 'h1') {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        if (e.target.value === 'ul') {
          if (blockType !== 'ul') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        }
        if (e.target.value === 'ol') {
          if (blockType !== 'ol') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        } else {
          $wrapNodes(selection, () =>
            $createHeadingNode(e.target.value as HeadingTagType)
          );
        }
      }
    });
    // }
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
      <FormControl sx={{ minWidth: 120 }} size="small">
        <Select
          value={blockType}
          onChange={handleBlockTypeChange}
          sx={{ minWidth: '200px' }}
        >
          <MenuItem value={'paragraph'}>Normal</MenuItem>
          <MenuItem value={'h1'}>Large heading</MenuItem>
          <MenuItem value={'h2'}>Small heading</MenuItem>
          <MenuItem value={'ul'}>Bullet list</MenuItem>
          <MenuItem value={'ol'}>Numbered list</MenuItem>
        </Select>
      </FormControl>
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
        <ToggleButton
          value="underlined"
          aria-label="underlined"
          onClick={toggleFormat('underline')}
        >
          <FormatUnderlinedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Toolbar>
  );
};

export default EditorToolbar;
