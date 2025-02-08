import type { EditorConfig, LexicalEditor, NodeKey, SerializedTextNode } from 'lexical';

import { TextNode } from 'lexical';

export default class CustomTextNode extends TextNode {
  __className: string;

  constructor(className: string = '', text: string, key?: NodeKey) {
    super(text, key);
    this.__className = className;
  }

  static clone(node: CustomTextNode) {
    return new CustomTextNode(node.__className, node.__text, node.__key);
  }

  static getType() {
    return 'custom-text';
  }

  static importJSON(serializedNode: SerializedTextNode): CustomTextNode {
    return <CustomTextNode>TextNode.importJSON(serializedNode);
  }

  createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
    const dom = super.createDOM(config, editor);
    dom.className = this.__className;
    return dom;
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
