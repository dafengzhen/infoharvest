import AutoLinkPlugin from '@/app/editor/plugins/auto-link-plugin';
import CodeHighlightPlugin from '@/app/editor/plugins/code-highlight-plugin';
import ToolbarPlugin from '@/app/editor/plugins/toolbar-plugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { Card, CardBody, CardHeader } from 'bootstrap-react-logic';
import clsx from 'clsx';

export default function CustomEditor({
  className,
  placeholder = 'Start typing...',
}: {
  className?: string;
  placeholder?: string;
}) {
  return (
    <Card className={clsx('rounded-4 border', className)}>
      <CardHeader className="bg-transparent border-bottom">
        <ToolbarPlugin />
      </CardHeader>
      <CardBody className="p-0 position-relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              aria-placeholder={placeholder}
              className="form-control px-3 rounded-top-0 rounded-bottom-4 border-0"
              placeholder={
                <div
                  className="position-absolute text-secondary pe-none user-select-none overflow-hidden"
                  style={{ left: '1rem', top: '0.375rem' }}
                >
                  {placeholder}
                </div>
              }
              style={{ minHeight: 150 }}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <AutoFocusPlugin />
        <AutoLinkPlugin />
        <CodeHighlightPlugin />
        <HistoryPlugin />
        <LinkPlugin />
        <ListPlugin />
        <TablePlugin hasHorizontalScroll />
      </CardBody>
    </Card>
  );
}
