import type { EditorConfig, LexicalNode, NodeKey, SerializedParagraphNode, Spread } from 'lexical';

import clsx from 'clsx';
import { ParagraphNode } from 'lexical';

export type SerializedCustomParagraphNode = SerializedCustomParagraphNodeV1;

export type SerializedCustomParagraphNodeV1 = Spread<
  {
    className: string;
  },
  SerializedParagraphNode
>;

export default class CustomParagraphNode extends ParagraphNode {
  __className: string;

  constructor(className: string = '', key?: NodeKey) {
    super(key);
    this.__className = className;
  }

  static clone(node: CustomParagraphNode) {
    return new CustomParagraphNode(node.__className, node.__key);
  }

  static getType() {
    return 'custom-paragraph';
  }

  static importJSON(serializedNode: SerializedCustomParagraphNode): CustomParagraphNode {
    const customParagraphNode = $createCustomParagraphNode();
    customParagraphNode.setClassName(serializedNode.className);
    return customParagraphNode;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.className = clsx(dom.className, this.__className);
    return dom;
  }

  exportJSON(): SerializedCustomParagraphNode {
    return {
      ...super.exportJSON(),
      className: this.__className,
    };
  }

  getClassName() {
    return this.__className;
  }

  setClassName(className: string) {
    const writableNode = this.getWritable();
    writableNode.__className = className;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    if (prevNode.__className !== this.__className) {
      dom.className = this.__className;
      return true;
    }
    return isUpdated;
  }
}

export function $createCustomParagraphNode(): CustomParagraphNode {
  return new CustomParagraphNode();
}

export function $isCustomParagraphNode(node: LexicalNode | null | undefined): node is CustomParagraphNode {
  return node instanceof CustomParagraphNode;
}
