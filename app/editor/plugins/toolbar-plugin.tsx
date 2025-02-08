import type { InsertImagePayload } from '@/app/editor/nodes/custom-Image-node';
import type { LexicalNode } from 'lexical';

import { $createImageNode, INSERT_IMAGE_COMMAND } from '@/app/editor/nodes/custom-Image-node';
import { $createCustomParagraphNode, $isCustomParagraphNode } from '@/app/editor/nodes/custom-paragraph-node';
import { getSelectedNode } from '@/app/editor/tools';
import { isNumeric, sanitizeUrl } from '@/app/tools';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $createLinkNode, $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $forEachSelectedTextNode, $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { $findMatchingParent, $getNearestNodeOfType, $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import { Button, ButtonGroup, CloseButton, Input, Label, Modal } from 'bootstrap-react-logic';
import clsx from 'clsx';
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isLineBreakNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';

const HeadingName = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textAlign, setTextAlign] = useState<'center' | 'justify' | 'left' | 'right' | null>(null);
  const [listType, setListType] = useState<'bullet' | 'check' | 'number' | null>(null);
  const [isCode, setIsCode] = useState(false);
  const [isCodeBlock, setIsCodeBlock] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [linkValue, setLinkValue] = useState('https://');
  const [imageValue, setImageValue] = useState<{
    dataUrl: string;
    height: 'inherit' | number;
    url: string;
    width: 'inherit' | number;
  }>({
    dataUrl: '',
    height: 'inherit',
    url: '',
    width: 'inherit',
  });
  const [imageStatus, setImageStatus] = useState<'error' | 'idle' | 'loaded' | 'loading'>('idle');
  const [isInitialized, setIsInitialized] = useState(false);
  const [heading, setHeading] = useState<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | null>(null);
  const [modals, setModals] = useState({
    image: false,
    link: false,
    table: false,
  });
  const [rows, setRows] = useState('');
  const [columns, setColumns] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const linkElementRef = useRef<HTMLInputElement>(null);
  const imageFileElementRef = useRef<HTMLInputElement>(null);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      const selectedNode = getSelectedNode(selection);
      let element =
        selectedNode.getKey() === 'root'
          ? selectedNode
          : $findMatchingParent(selectedNode, (e: LexicalNode) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = selectedNode.getTopLevelElementOrThrow();
      }

      // p
      if ($isCustomParagraphNode(element)) {
        let _textAlign: 'center' | 'justify' | 'left' | 'right' | null = null;
        const className = element.getClassName();
        if (className.includes('text-center')) {
          _textAlign = 'center';
        } else if (className.includes('text-end')) {
          _textAlign = 'right';
        } else if (className.includes('text-justify')) {
          _textAlign = 'justify';
        } else if (className.includes('text-start')) {
          _textAlign = 'left';
        }

        setTextAlign(_textAlign);
      }

      // list
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(selectedNode, ListNode);
        const type = parentList ? parentList.getListType() : element.getListType();
        setListType(type);
      } else {
        setListType(null);
      }

      // linkValue
      const linkParent = $findMatchingParent(selectedNode, $isLinkNode);
      if (linkParent) {
        setLinkValue(linkParent.getURL());
      } else if ($isLinkNode(selectedNode)) {
        setLinkValue(selectedNode.getURL());
      } else if ($isCodeNode(element)) {
        setIsCodeBlock(true);
      } else {
        setIsCodeBlock(false);
      }

      // isLink
      const focusLinkNode = $findMatchingParent(selectedNode, $isLinkNode);
      const focusAutoLinkNode = $findMatchingParent(selectedNode, $isAutoLinkNode);
      if (!(focusLinkNode || focusAutoLinkNode)) {
        setIsLink(false);
      } else {
        const badNode = selection
          .getNodes()
          .filter((node) => !$isLineBreakNode(node))
          .find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode);
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode);
            return (
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              (linkNode && !linkNode.is(focusLinkNode)) ||
              (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
              (autoLinkNode && (!autoLinkNode.is(focusAutoLinkNode) || autoLinkNode.getIsUnlinked()))
            );
          });
        setIsLink(!badNode);
      }

      // heading
      const type = $isHeadingNode(element) ? element.getTag() : element.getType();
      if (type in HeadingName) {
        setHeading(type as keyof typeof HeadingName);
      } else {
        setHeading(null);
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        REMOVE_LIST_COMMAND,
        () => {
          setListType(null);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        FORMAT_ELEMENT_COMMAND,
        (formatType) => {
          editor.update(() => {
            $forEachSelectedTextNode((node) => {
              let newClassName = '';
              switch (formatType) {
                case 'center':
                  newClassName = 'text-center';
                  break;
                case 'justify':
                  newClassName = 'text-justify';
                  break;
                case 'left':
                  newClassName = 'text-start';
                  break;
                case 'right':
                  newClassName = 'text-end';
                  break;
                default:
                  break;
              }

              const element = node.getKey() === 'root' ? node : node.getParent();
              if ($isCustomParagraphNode(element)) {
                element.setClassName(newClassName);
              }
            });
          });
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);
  useEffect(() => {
    const currentElement = linkElementRef.current;
    if (modals.link && currentElement) {
      const timeout = setTimeout(() => currentElement.focus(), 100);
      return () => clearTimeout(timeout);
    }
  }, [modals.link]);
  useEffect(() => {
    const row = Number(rows);
    const column = Number(columns);
    if (row && row > 0 && row <= 500 && column && column > 0 && column <= 50) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [rows, columns]);
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  function deleteLink() {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    toggleModal('link', false);
  }
  function confirmLink() {
    const value = linkValue.trim();
    if (!value) {
      deleteLink();
      return;
    }

    editor.update(() => {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(value));
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const parent = getSelectedNode(selection).getParent();
        if ($isAutoLinkNode(parent)) {
          const linkNode = $createLinkNode(parent.getURL(), {
            rel: parent.__rel,
            target: parent.__target,
            title: parent.__title,
          });
          parent.replace(linkNode, true);
        }
      }
    });

    toggleModal('link', false);
  }
  function confirmImage() {
    const urlValue = imageValue.url.trim();
    const dataUrlValue = imageValue.dataUrl.trim();
    const value = dataUrlValue || urlValue;
    if (value) {
      if (urlValue && (imageValue.width === 'inherit' || imageValue.height === 'inherit')) {
        handleImageLoad(urlValue, (width, height) => {
          insertImage(value, width, height);
          toggleModal('image', false);
        });
        return;
      }

      insertImage(
        value,
        imageValue.width === 'inherit' ? 0 : imageValue.width,
        imageValue.height === 'inherit' ? 0 : imageValue.height,
      );
      toggleModal('image', false);
    }
  }
  function confirmTable() {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: columns + '',
      rows: rows + '',
    });
    toggleModal('table', false);
  }
  function insertImage(value: string, width: number, height: number) {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      altText: 'image',
      height,
      src: value,
      width,
    });

    setImageValue({ dataUrl: '', height: 'inherit', url: '', width: 'inherit' });
    setImageStatus('idle');

    if (imageFileElementRef.current) {
      imageFileElementRef.current.value = '';
    }
  }
  function toggleModal(modalName: 'image' | 'link' | 'table', isVisible: boolean = true) {
    setModals((prev) => ({ ...prev, [modalName]: isVisible }));
  }
  function handleImageLoad(value: string, callback: (width: number, height: number) => void) {
    setImageStatus('loading');
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      setImageStatus('loaded');
      callback(width, height);
    };
    img.onerror = () => {
      setImageStatus('error');
      console.error('Failed to load the image.');
    };
    img.src = value!;
  }
  function formatCodeBlock() {
    editor.update(() => {
      let selection = $getSelection();
      if (selection !== null) {
        if (selection.isCollapsed()) {
          $setBlocksType(selection, () => $createCodeNode());
        } else {
          const textContent = selection.getTextContent();
          const codeNode = $createCodeNode();
          selection.insertNodes([codeNode]);
          selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertRawText(textContent);
          }
        }
      }
    });
  }

  return (
    <>
      <ButtonGroup className="gap-2" toolbar>
        <ButtonGroup size="sm">
          <Button
            active={heading === 'h1'}
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if (heading === 'h1') {
                  $setBlocksType(selection, () => $createCustomParagraphNode());
                } else {
                  $setBlocksType(selection, () => $createHeadingNode('h1'));
                }
              });
            }}
            outline={heading === 'h1' ? 'primary' : 'secondary'}
          >
            <i className="bi bi-type-h1"></i>
          </Button>
          <Button
            active={heading === 'h2'}
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if (heading === 'h2') {
                  $setBlocksType(selection, () => $createCustomParagraphNode());
                } else {
                  $setBlocksType(selection, () => $createHeadingNode('h2'));
                }
              });
            }}
            outline={heading === 'h2' ? 'primary' : 'secondary'}
          >
            <i className="bi bi-type-h2"></i>
          </Button>
          <Button
            active={heading === 'h3'}
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if (heading === 'h3') {
                  $setBlocksType(selection, () => $createCustomParagraphNode());
                } else {
                  $setBlocksType(selection, () => $createHeadingNode('h3'));
                }
              });
            }}
            outline={heading === 'h3' ? 'primary' : 'secondary'}
          >
            <i className="bi bi-type-h3"></i>
          </Button>
          <Button
            active={heading === 'h4'}
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if (heading === 'h4') {
                  $setBlocksType(selection, () => $createCustomParagraphNode());
                } else {
                  $setBlocksType(selection, () => $createHeadingNode('h4'));
                }
              });
            }}
            outline={heading === 'h4' ? 'primary' : 'secondary'}
          >
            <i className="bi bi-type-h4"></i>
          </Button>
          <Button
            active={heading === 'h5'}
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if (heading === 'h5') {
                  $setBlocksType(selection, () => $createCustomParagraphNode());
                } else {
                  $setBlocksType(selection, () => $createHeadingNode('h5'));
                }
              });
            }}
            outline={heading === 'h5' ? 'primary' : 'secondary'}
          >
            <i className="bi bi-type-h5"></i>
          </Button>
        </ButtonGroup>

        <ButtonGroup size="sm">
          <Button
            active={isBold}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            outline={isBold ? 'primary' : 'secondary'}
          >
            <i className="bi bi-type-bold"></i>
          </Button>
          <Button
            active={isItalic}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            outline={isItalic ? 'primary' : 'secondary'}
          >
            <i className="bi bi-type-italic"></i>
          </Button>
          <Button
            active={isUnderline}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            outline={isUnderline ? 'primary' : 'secondary'}
          >
            <i className="bi bi-type-underline"></i>
          </Button>
          <Button
            active={isStrikethrough}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}
            outline={isStrikethrough ? 'primary' : 'secondary'}
          >
            <i className="bi bi-type-strikethrough"></i>
          </Button>
        </ButtonGroup>

        <ButtonGroup size="sm">
          <Button
            active={textAlign === 'left'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, textAlign === 'left' ? '' : 'left');
            }}
            outline={textAlign === 'left' ? 'primary' : 'secondary'}
          >
            <i className="bi bi-text-left"></i>
          </Button>
          <Button
            active={textAlign === 'center'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, textAlign === 'center' ? '' : 'center');
            }}
            outline={textAlign === 'center' ? 'primary' : 'secondary'}
          >
            <i className="bi bi-text-center"></i>
          </Button>
          <Button
            active={textAlign === 'right'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, textAlign === 'right' ? '' : 'right');
            }}
            outline={textAlign === 'right' ? 'primary' : 'secondary'}
          >
            <i className="bi bi-text-right"></i>
          </Button>
          {/*<Button*/}
          {/*  active={textAlign === 'justify'}*/}
          {/*  onClick={() => {*/}
          {/*    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, textAlign === 'justify' ? '' : 'justify');*/}
          {/*  }}*/}
          {/*  outline={textAlign === 'justify' ? 'primary' : 'secondary'}*/}
          {/*>*/}
          {/*  <i className="bi bi-justify"></i>*/}
          {/*</Button>*/}
          <Button
            active={listType === 'bullet'}
            onClick={() => {
              editor.dispatchCommand(
                listType === 'bullet' ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
                undefined,
              );
            }}
            outline={listType === 'bullet' ? 'primary' : 'secondary'}
          >
            <i className="bi bi-list-ul"></i>
          </Button>
          <Button
            active={listType === 'number'}
            onClick={() => {
              editor.dispatchCommand(
                listType === 'number' ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
                undefined,
              );
            }}
            outline={listType === 'number' ? 'primary' : 'secondary'}
          >
            <i className="bi bi-list-ol"></i>
          </Button>
        </ButtonGroup>

        <ButtonGroup size="sm">
          <Button
            active={isCode}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
            outline={isCode ? 'primary' : 'secondary'}
          >
            <i className="bi bi-code"></i>
          </Button>
          <Button active={isCodeBlock} onClick={formatCodeBlock} outline={isCodeBlock ? 'primary' : 'secondary'}>
            <i className="bi bi-code-square"></i>
          </Button>
          <Button
            active={isLink}
            onClick={() => {
              if (!isLink) {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
              }

              toggleModal('link');
            }}
            outline={isLink ? 'primary' : 'secondary'}
          >
            <i className="bi bi-link-45deg"></i>
          </Button>
          <Button onClick={() => toggleModal('image')} outline="secondary">
            <i className="bi bi-image"></i>
          </Button>
          <Button onClick={() => toggleModal('table')} outline="secondary">
            <i className="bi bi-table"></i>
          </Button>
        </ButtonGroup>

        <ButtonGroup size="sm">
          <Button
            className={clsx(!canUndo && 'border-secondary-subtle')}
            disabled={!canUndo}
            onClick={() => {
              editor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
            outline="secondary"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </Button>
          <Button
            className={clsx(!canRedo && 'border-secondary-subtle')}
            disabled={!canRedo}
            onClick={() => {
              editor.dispatchCommand(REDO_COMMAND, undefined);
            }}
            outline="secondary"
          >
            <i className="bi bi-arrow-clockwise"></i>
          </Button>
        </ButtonGroup>
      </ButtonGroup>

      {isInitialized && (
        <>
          <Modal
            body={
              <Input
                onChange={(e) => setLinkValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    confirmLink();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleModal('link', false);
                  }
                }}
                onRef={(instance) => {
                  linkElementRef.current = instance;
                }}
                placeholder="Enter the link"
                type="text"
                value={linkValue}
              />
            }
            centered
            footer={
              <>
                <Button onClick={() => toggleModal('link', false)} type="button" variant="secondary">
                  Cancel
                </Button>
                <Button onClick={confirmLink} type="button" variant="primary">
                  Confirm
                </Button>
              </>
            }
            header={<CloseButton onClick={() => toggleModal('link', false)} type="button" />}
            onVisibleChange={(value) => toggleModal('link', value)}
            tabIndex={-1}
            title="PrepForge"
            visible={modals.link}
          />

          <Modal
            body={
              <div className="d-flex flex-column gap-2" key="image">
                <Input
                  onChange={(e) => setImageValue({ ...imageValue, url: e.target.value })}
                  placeholder="Enter the image url"
                  type="text"
                  value={imageValue.url}
                />

                <Input
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        handleImageLoad(reader.result, (width, height) =>
                          setImageValue({ ...imageValue, dataUrl: reader.result as string, height, width }),
                        );
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  onRef={(instance) => {
                    imageFileElementRef.current = instance;
                  }}
                  type="file"
                />

                <div className="d-flex gap-3">
                  <div className="row g-3 align-items-center">
                    <div className="col-auto">
                      <Label colFormLabel>Width</Label>
                    </div>
                    <div className="col">
                      <Input
                        onChange={(e) => {
                          const value = e.target.value;
                          if (isNumeric(value)) {
                            setImageValue({ ...imageValue, width: parseInt(value) });
                          }
                        }}
                        placeholder="Inherit"
                        type="text"
                        value={imageValue.width === 'inherit' ? '' : imageValue.width}
                      />
                    </div>
                  </div>
                  <div className="row g-3 align-items-center">
                    <div className="col-auto">
                      <Label colFormLabel>Height</Label>
                    </div>
                    <div className="col">
                      <Input
                        onChange={(e) => {
                          const value = e.target.value;
                          if (isNumeric(value)) {
                            setImageValue({ ...imageValue, height: parseInt(value) });
                          }
                        }}
                        placeholder="Inherit"
                        type="text"
                        value={imageValue.height === 'inherit' ? '' : imageValue.height}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }
            centered
            footer={
              <>
                <Button onClick={() => toggleModal('image', false)} type="button" variant="secondary">
                  Cancel
                </Button>
                <Button
                  disabled={(!imageValue.url && imageStatus !== 'loaded') || imageStatus === 'loading'}
                  isLoading={imageStatus === 'loading'}
                  onClick={confirmImage}
                  type="button"
                  variant="primary"
                >
                  Confirm
                </Button>
              </>
            }
            header={<CloseButton onClick={() => toggleModal('image', false)} type="button" />}
            onVisibleChange={(value) => toggleModal('image', value)}
            tabIndex={-1}
            title="PrepForge"
            visible={modals.image}
          />

          <Modal
            body={
              <div className="d-flex flex-column gap-2" key="table">
                <Input
                  maxLength={3}
                  min={1}
                  onChange={(e) => setRows(e.target.value)}
                  placeholder="# of rows (1-500)"
                  type="number"
                  value={rows}
                />

                <Input
                  maxLength={2}
                  min={1}
                  onChange={(e) => setColumns(e.target.value)}
                  placeholder="# of columns (1-50)"
                  type="number"
                  value={columns}
                />
              </div>
            }
            centered
            footer={
              <>
                <Button onClick={() => toggleModal('table', false)} type="button" variant="secondary">
                  Cancel
                </Button>
                <Button disabled={isDisabled} onClick={confirmTable} type="button" variant="primary">
                  Confirm
                </Button>
              </>
            }
            header={<CloseButton onClick={() => toggleModal('table', false)} type="button" />}
            onVisibleChange={(value) => toggleModal('table', value)}
            tabIndex={-1}
            title="PrepForge"
            visible={modals.table}
          />
        </>
      )}
    </>
  );
}
