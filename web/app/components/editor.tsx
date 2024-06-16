import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@/editor';
import type { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import type { EventInfo } from '@ckeditor/ckeditor5-utils';

export interface EditorErrorDetails {
  phase: 'initialization' | 'runtime';
  willEditorRestart?: boolean;
}

export default function CustomEditor(props: {
  initialData?: string | null | undefined;
  onReady?: ((editor: ClassicEditor) => void) | undefined;
  onChange?:
    | ((event: EventInfo<string, unknown>, editor: ClassicEditor) => void)
    | undefined;
  onError?: ((error: Error, details: EditorErrorDetails) => void) | undefined;
  onBlur?:
    | ((event: EventInfo<string, unknown>, editor: ClassicEditor) => void)
    | undefined;
  onFocus?:
    | ((event: EventInfo<string, unknown>, editor: ClassicEditor) => void)
    | undefined;
}) {
  return (
    <CKEditor
      editor={Editor}
      data={props.initialData}
      onChange={props.onChange}
      onReady={props.onReady}
      onError={props.onError}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
    />
  );
}
