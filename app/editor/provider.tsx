import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import type { LexicalEditor } from 'lexical';
import type { ReactNode } from 'react';

import { CustomImageNode } from '@/app/editor/nodes/custom-Image-node';
import CustomParagraphNode from '@/app/editor/nodes/custom-paragraph-node';
import theme from '@/app/editor/theme';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HeadingNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ParagraphNode } from 'lexical';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
const onError: (error: Error, editor: LexicalEditor) => void = (error) => {
  throw error;
};

const initialConfig: InitialConfigType = {
  namespace: 'CustomEditor',
  nodes: [
    AutoLinkNode,
    LinkNode,
    ListItemNode,
    ListNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    CustomParagraphNode,
    CodeHighlightNode,
    CodeNode,
    CustomImageNode,
    HeadingNode,
    {
      replace: ParagraphNode,
      with: () => {
        return new CustomParagraphNode();
      },
      withKlass: CustomParagraphNode,
    },
  ],
  onError,
  theme,
};

export default function LexicalProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <LexicalComposer initialConfig={initialConfig}>{children}</LexicalComposer>;
}
