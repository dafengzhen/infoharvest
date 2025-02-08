import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import type { ReactNode } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import clsx from 'clsx';
import {
  $applyNodeReplacement,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DecoratorNode,
  KEY_BACKSPACE_COMMAND,
} from 'lexical';
import NextImage from 'next/image';
import { useCallback, useEffect, useRef } from 'react';

export interface ImagePayload {
  altText: string;
  height: 'inherit' | number;
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width: 'inherit' | number;
}

export type InsertImagePayload = Readonly<ImagePayload>;

export type LexicalUpdateJSON<T extends SerializedLexicalNode> = Omit<T, 'children' | 'type' | 'version'>;

export type SerializedImageNode = Spread<
  {
    altText: string;
    height: number;
    maxWidth?: number;
    src: string;
    width: number;
  },
  SerializedLexicalNode
>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand('INSERT_IMAGE_COMMAND');

const ImageComponent = ({
  altText,
  height,
  maxWidth,
  nodeKey,
  src,
  width,
}: {
  altText: string;
  height: number;
  maxWidth?: number;
  nodeKey: NodeKey;
  src: string;
  width: number;
}) => {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const isFocused = isSelected && isEditable;

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (event.target === imageRef.current) {
        clearSelection();
        setSelected(true);
        return true;
      }

      return false;
    },
    [clearSelection, setSelected],
  );

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      const deleteSelection = $getSelection();
      if (isSelected && $isNodeSelection(deleteSelection)) {
        event.preventDefault();
        editor.update(() => {
          deleteSelection.getNodes().forEach((node) => {
            if ($isImageNode(node)) {
              node.remove();
            }
          });
        });
      }
      return false;
    },
    [editor, isSelected],
  );

  useEffect(() => {
    const unregister = mergeRegister(
      editor.registerCommand<MouseEvent>(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
    );

    return () => {
      unregister();
    };
  }, [editor, onClick, onDelete]);

  return (
    <NextImage
      alt={altText}
      className={clsx(isFocused && 'img-focused user-select-none')}
      height={height}
      ref={imageRef}
      src={src}
      style={{
        maxWidth,
      }}
      width={width}
    />
  );
};

export class CustomImageNode extends DecoratorNode<ReactNode> {
  __altText: string;
  __height: number;
  __maxWidth?: number;
  __src: string;
  __width: number;

  constructor(
    src: string,
    altText: string,
    width: 'inherit' | number,
    height: 'inherit' | number,
    maxWidth?: number,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width === 'inherit' ? 0 : width;
    this.__height = height === 'inherit' ? 0 : height;
  }

  static clone(node: CustomImageNode): CustomImageNode {
    return new CustomImageNode(node.__src, node.__altText, node.__width, node.__height, node.__maxWidth, node.__key);
  }

  static getType(): string {
    return 'customImage';
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  static importJSON(serializedNode: SerializedImageNode): CustomImageNode {
    const { altText, height, maxWidth, src, width } = serializedNode;
    return $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
    }).updateFromJSON(serializedNode);
  }

  createDOM(): HTMLElement {
    return document.createElement('span');
  }

  decorate(): ReactNode {
    return (
      <ImageComponent
        altText={this.__altText}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        src={this.__src}
        width={this.__width}
      />
    );
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.setAttribute('width', this.__width.toString());
    element.setAttribute('height', this.__height.toString());
    return { element };
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.getAltText(),
      height: this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      width: this.__width,
    };
  }

  getAltText(): string {
    return this.__altText;
  }

  getSrc(): string {
    return this.__src;
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>): this {
    return super.updateFromJSON(serializedNode);
  }
}

export function $createImageNode({ altText, height, key, maxWidth, src, width }: ImagePayload): CustomImageNode {
  return $applyNodeReplacement(new CustomImageNode(src, altText, width, height, maxWidth, key));
}

export function $isImageNode(node: LexicalNode | null | undefined): node is CustomImageNode {
  return node instanceof CustomImageNode;
}

function $convertImageElement(domNode: Node): DOMConversionOutput | null {
  const img = domNode as HTMLImageElement;
  if (img.src.startsWith('file:///') || isGoogleDocCheckboxImg(img)) {
    return null;
  }
  const { alt: altText, height, src, width } = img;
  const node = $createImageNode({ altText, height, src, width });
  return { node };
}

function isGoogleDocCheckboxImg(img: HTMLImageElement): boolean {
  return (
    img.parentElement != null &&
    img.parentElement.tagName === 'LI' &&
    img.previousSibling === null &&
    img.getAttribute('aria-roledescription') === 'checkbox'
  );
}
