import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
} from 'lexical';
import { useRouter } from 'next/router';
import React, { useCallback, useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import EditorToolbar from './ToolbarPlugin';
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
import { Button, Divider, TextField, Typography } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';

const DescriptionWatcherPlugin = ({ updateHandler }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const markdown = $convertToMarkdownString(TRANSFORMERS);
          console.log('calling update handler');
          updateHandler(markdown);
        });
      })
    );
  }, [editor, updateHandler]);

  return <div />;
};

const ReactStatePlugin = ({ description }: { description: string }) => {
  const [editor] = useLexicalComposerContext();
  console.log('plugin', description);

  useEffect(() => {
    console.log('running update');
    editor.update(() => {
      // Get the RootNode from the EditorState
      const root = $getRoot();
      root.clear();

      // Create a new ParagraphNode
      const paragraphNode = $createParagraphNode();

      // Create a new TextNode
      const textNode = $createTextNode($convertFromMarkdownString(description));

      // Append the text node to the paragraph
      paragraphNode.append(textNode);

      // Finally, append the paragraph to the root
      root.append(paragraphNode);
    });
  }, [editor, description]);
  return <div />;
};

export const TextEditor = (props) => {
  console.log('text editor', props.description);
  const editorConfig = {
    namespace: 'speciesInformation',
    editorState: () =>
      $convertFromMarkdownString(props.description, TRANSFORMERS),
    onError(error) {
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
        <Divider />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={'Enter some text'}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ReactStatePlugin description={props.initialDescription} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>

      <DescriptionWatcherPlugin updateHandler={props.setDescription} />
    </LexicalComposer>
  );
};
