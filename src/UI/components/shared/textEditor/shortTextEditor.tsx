import React, { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import EditorToolbar from './ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
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
import { Typography } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';

const ShortDescriptionWatcherPlugin = ({
  updateHandler,
}: {
  updateHandler: (shortDescription: string) => void;
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

const ShortReactStatePlugin = ({
  shortDescription,
}: {
  shortDescription: string;
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      $convertFromMarkdownString(shortDescription);
    });
  }, [editor, shortDescription]);
  return <div />;
};

export const ShortTextEditor = (props: {
  shortDescription: string;
  initialShortDescription: string;
  setShortDescription: (d: string) => void;
  error?: boolean;
  helperText?: string;
}) => {
  const editorConfig = {
    namespace: 'shortDescription',
    editorState: () =>
      $convertFromMarkdownString(props.shortDescription, TRANSFORMERS),
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
          <ShortReactStatePlugin
            shortDescription={props.initialShortDescription}
          />
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

      <ShortDescriptionWatcherPlugin
        updateHandler={props.setShortDescription}
      />
    </LexicalComposer>
  );
};
