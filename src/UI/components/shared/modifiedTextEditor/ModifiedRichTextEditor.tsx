import React, { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import EditorToolbar from './ModifiedToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { Divider, Typography } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';

const DescriptionWatcherPlugin = ({
  updateHandler,
}: {
  updateHandler: (description: string) => void;
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const markdown = $convertToMarkdownString(TRANSFORMERS);
          updateHandler(markdown);
        });
      })
    );
  }, [editor, updateHandler]);

  return <div />;
};

const ReactStatePlugin = ({ description }: { description: string }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      $convertFromMarkdownString(description);
    });
  }, [editor, description]);
  return <div />;
};

export const ModifiedRichTextEditor = (props: {
  description: string;
  initialDescription: string;
  setDescription: (d: string) => void;
  error?: boolean;
  helperText?: string;
}) => {
  const editorConfig = {
    namespace: 'speciesInformation',
    editorState: () =>
      $convertFromMarkdownString(props.description, TRANSFORMERS),
    onError(error: Error) {
      throw error;
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <EditorToolbar />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={
                  !props.error ? 'editor-input' : 'editor-input editor-error'
                }
              />
            }
            placeholder={''}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ReactStatePlugin description={props.initialDescription} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
        {props.helperText ? (
          <Typography
            style={{
              color: '#ff1744',
              fontSize: '0.75rem',
              lineHeight: 1.66,
              marginTop: 3,
              marginRight: 14,
              marginLeft: 14,
            }}
          >
            {props.helperText}
          </Typography>
        ) : null}
      </div>

      <DescriptionWatcherPlugin updateHandler={props.setDescription} />
    </LexicalComposer>
  );
};
