import type { IError } from '@/app/interfaces';
import type { ICollection } from '@/app/interfaces/collection';
import type {
  IExcerpt,
  IExcerptLink,
  IExcerptName,
  ISaveExcerptDto,
  ISaveExcerptLinkDto,
  ISaveExcerptNameDto,
} from '@/app/interfaces/excerpt';
import type { ChangeEvent, FormEvent, SyntheticEvent } from 'react';

import { useFetchExcerptsByCollectionId } from '@/app/apis/collections';
import { useFetchExcerpts, useSaveExcerpt } from '@/app/apis/excerpts';
import CustomEditor from '@/app/components/custom-editor';
import { BLUR_DATA_URL } from '@/app/constants';
import LexicalProvider from '@/app/editor/provider';
import { getQueryClient } from '@/app/get-query-client';
import { useTheme } from '@/app/hooks';
import useToast from '@/app/hooks/toast';
import { isValidIconURL, sanitizeInput } from '@/app/tools';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Input, Label, Text } from 'bootstrap-react-logic';
import clsx from 'clsx';
import { $getRoot, $insertNodes } from 'lexical';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ISaveExcerptFormDto extends ISaveExcerptDto {
  links: ISaveExcerptLinkDto[];
}

const initializeForm = (
  collectionId: null | number | undefined,
  excerpt: Partial<IExcerpt>,
  isUpdate = false,
): ISaveExcerptFormDto => {
  const _collectionId = typeof collectionId === 'number' ? collectionId : undefined;

  if (!isUpdate) {
    return {
      collectionId: _collectionId,
      darkIcon: '',
      description: '',
      icon: '',
      id: undefined,
      links: [
        {
          link: '',
        },
      ],
      names: [
        {
          name: '',
        },
      ],
      order: 0,
    };
  }

  const names = excerpt.names?.map(({ id, name = '' }) => ({ id, name })) ?? [];
  if (names.length === 0) {
    names.push({ name: '' } as IExcerptName);
  }

  const links = excerpt.links?.map(({ id, link = '' }) => ({ id, link })) ?? [];
  if (links.length === 0) {
    links.push({ link: '' } as IExcerptLink);
  }

  return {
    collectionId: _collectionId,
    darkIcon: excerpt.darkIcon ?? '',
    description: excerpt.description ?? '',
    icon: excerpt.icon ?? '',
    id: excerpt.id,
    links,
    names,
    order: excerpt.order,
  };
};

const InputField = ({ label, text, ...props }: { [_: string]: unknown; label?: string; text?: string }) => (
  <div>
    {label && <Label>{label}</Label>}
    <Input {...props} />
    {text && <Text>{text}</Text>}
  </div>
);

const ExcerptChildForm = ({
  child,
  index,
  isLoading,
  item,
  onAdd,
  onChange,
  onRemove,
}: {
  child: ISaveExcerptLinkDto | ISaveExcerptNameDto;
  index: number;
  isLoading: boolean;
  item: {
    label: string;
    text: string;
    type: 'links' | 'names';
  };
  onAdd: (index: number, type: 'links' | 'names') => void;
  onChange: (
    index: number,
    key: keyof ISaveExcerptLinkDto | keyof ISaveExcerptNameDto,
    value: number | string,
    type: 'links' | 'names',
  ) => void;
  onRemove: (index: number, type: 'links' | 'names') => void;
}) => {
  const name = item.type === 'links' ? 'link' : 'name';
  const label = item.type === 'links' ? 'Link' : 'Name';

  return (
    <div className="row">
      <div className="col">
        <Card cardBody className={clsx('border vstack gap-3')}>
          <InputField
            disabled={isLoading}
            label={label}
            name={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(index, name, e.target.value, item.type)}
            placeholder={`Enter the ${name}`}
            type="text"
            value={item.type === 'links' ? (child as ISaveExcerptLinkDto).link : (child as ISaveExcerptNameDto).name}
          />
        </Card>
      </div>
      <div className="col-auto align-self-center">
        <Button disabled={isLoading} onClick={() => onAdd(index, item.type)} type="button" variant="secondary">
          <i className="bi bi-plus-lg"></i>
        </Button>
        <Button
          className="ms-2"
          disabled={isLoading}
          onClick={() => onRemove(index, item.type)}
          type="button"
          variant="secondary"
        >
          <i className="bi bi-dash-lg"></i>
        </Button>
      </div>
    </div>
  );
};

const SaveExcerpt = ({
  collection,
  excerpt,
  isUpdate,
}: {
  collection: ICollection | null;
  excerpt: Partial<IExcerpt>;
  isUpdate?: boolean;
}) => {
  const [form, setForm] = useState<ISaveExcerptFormDto>(initializeForm(collection?.id, excerpt, isUpdate));
  const [isInitialized, setIsInitialized] = useState(false);
  const [showRichTextEditor, setShowRichTextEditor] = useState(false);

  const toastRef = useToast();
  const [editor] = useLexicalComposerContext();
  const { isDarkMode } = useTheme();

  const saveExcerptMutation = useSaveExcerpt();

  const isLoading = saveExcerptMutation.isPending;

  useEffect(() => {
    setForm(initializeForm(collection?.id, excerpt, isUpdate));
  }, [collection?.id, excerpt, isUpdate]);
  useEffect(() => {
    let isMounted = true;

    const description = isUpdate ? (form.description ?? '') : '';
    if (isInitialized && isMounted && description) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(description, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.select();
        $insertNodes(nodes);
      });

      setShowRichTextEditor(true);
    } else if (!isUpdate) {
      editor.update(() => $getRoot().clear());
    }

    return () => {
      isMounted = false;
    };
  }, [editor, form.description, isInitialized, isUpdate]);
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  function handleDescription() {
    const htmlString = editor.read(() => $generateHtmlFromNodes(editor, null));
    return sanitizeInput(htmlString || '').trim();
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    if (form.icon && !isValidIconURL(form.icon)) {
      toast.showToast('Invalid icon URL', 'danger');
      return;
    }

    if (form.darkIcon && !isValidIconURL(form.darkIcon)) {
      toast.showToast('Invalid dark icon URL', 'danger');
      return;
    }

    if (form.names.length === 0 || form.names.map((item) => item.name.trim()).length === 0) {
      toast.showToast('Excerpt name cannot be empty', 'danger');
      return;
    }

    try {
      const newForm = { ...form, description: handleDescription() };
      await saveExcerptMutation.mutateAsync(newForm);

      if (!isUpdate) {
        setForm(initializeForm(null, {}, false));
      }

      toast.showToast('Saved successfully', 'success');

      void refreshQuery();
    } catch (error) {
      toast.showToast((error as IError).message, 'danger');
    }
  }

  async function refreshQuery() {
    const queryClient = getQueryClient();

    void queryClient.refetchQueries({ predicate: (query) => query.queryKey.includes(useFetchExcerpts.key) });

    if (typeof collection?.id === 'number') {
      void queryClient.refetchQueries({
        predicate: (query) => query.queryKey.includes(useFetchExcerptsByCollectionId.key),
      });
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleChildChange(
    index: number,
    key: keyof ISaveExcerptLinkDto | keyof ISaveExcerptNameDto,
    value: number | string,
    type: 'links' | 'names',
  ) {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].map((child, i) => (i === index ? { ...child, [key]: value } : child)),
    }));
  }

  function addChild(index: number, type: 'links' | 'names') {
    setForm((prev) => {
      const newChild = type === 'names' ? { name: '', order: 0 } : { link: '', order: 0 };
      const newChildren = [...prev[type]];

      if (index !== undefined && index >= 0 && index <= newChildren.length) {
        newChildren.splice(index, 0, newChild);
      } else {
        newChildren.push(newChild);
      }

      return { ...prev, [type]: newChildren };
    });
  }

  function removeChild(index: number, type: 'links' | 'names') {
    setForm((prev) => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  }

  function clickImage() {
    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    if (form.icon || form.darkIcon) {
      const url = (isDarkMode ? form.darkIcon : form.icon)!;

      if (isValidIconURL(url)) {
        try {
          window.open(url, '_blank');
        } catch (error) {
          toast.showToast((error as IError).message, 'danger');
        }
      }
    }
  }

  function handleErrorImage(e: SyntheticEvent<HTMLImageElement>) {
    console.error(e);

    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    toast.showToast('Failed to load image icon', 'danger');
  }

  function getCollectionPath(item: ICollection | undefined) {
    const path = [];
    while (item) {
      path.unshift(item.name);
      item = item.parent;
    }
    return path.join(' / ');
  }

  return (
    <form className="vstack gap-3" onSubmit={handleSave}>
      {typeof collection?.id === 'number' && (
        <div>
          <Label>Selected Collection</Label>
          <div className="hstack gap-1 px-075 py-037 text-secondary rounded border text-bg-secondary bg-opacity-10 cursor-not-allowed">
            <div className="hstack gap-1">
              <i className="bi bi-folder"></i>
              {getCollectionPath(collection)}
            </div>
          </div>
        </div>
      )}

      <div>
        <Label>Icon</Label>
        <div className="d-flex gap-2" style={{ height: 80 }}>
          <div
            className={clsx(
              'img-thumbnail d-flex align-items-center justify-content-center',
              (form.icon || form.darkIcon) && 'cursor-pointer',
            )}
            onClick={clickImage}
            style={{ width: 131 }}
          >
            {((!isDarkMode && form.icon) || (isDarkMode && form.darkIcon)) &&
            isValidIconURL((form.icon || form.darkIcon)!) ? (
              <Image
                alt="Icon"
                blurDataURL={BLUR_DATA_URL}
                className="object-fit-cove"
                height={64}
                onError={handleErrorImage}
                placeholder="blur"
                priority
                src={(isDarkMode ? form.darkIcon : form.icon)!}
                width={64}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  height: 64,
                  width: 64,
                }}
              >
                <i className="bi bi-image fs-2 text-secondary"></i>
              </div>
            )}
          </div>
          <div className="flex-grow-1">
            <Input
              autoFocus
              disabled={isLoading}
              name="icon"
              onChange={handleChange}
              placeholder="Enter the icon"
              type="text"
              value={form.icon}
            />
            <Input
              className="mt-1"
              disabled={isLoading}
              name="darkIcon"
              onChange={handleChange}
              placeholder="Enter the dark icon"
              type="text"
              value={form.darkIcon}
            />
          </div>
        </div>
        <Text>Supports setting a Light Icon URL or Data URL</Text>
      </div>

      <InputField
        disabled={isLoading}
        label="Order"
        min={0}
        minLength={1}
        name="order"
        onChange={handleChange}
        placeholder="Enter the order"
        text="The minimum order value is 0, and the default sorting is descending."
        type="number"
        value={form.order}
      />

      {(
        [
          {
            label: 'Names',
            text: 'Multiple names can be set, only the first name is displayed by default when empty.',
            type: 'names',
          },
          {
            label: 'Links',
            text: 'Multiple links can be set, only the first link is displayed by default when empty.',
            type: 'links',
          },
        ] as {
          label: string;
          text: string;
          type: 'links' | 'names';
        }[]
      ).map((item) => {
        return (
          <div key={item.type}>
            <div className="row">
              <div className="col-auto align-self-center">
                <Label className="mb-0">
                  <span>{item.label}</span>
                  {form[item.type].length > 0 && (
                    <span className="text-secondary">{` (${form[item.type].length})`}</span>
                  )}
                </Label>
              </div>
              <div className="col align-self-center">
                <hr className="text-secondary" />
              </div>

              {form[item.type].length === 0 && (
                <div className="col-auto align-self-center">
                  <Button disabled={isLoading} onClick={() => addChild(0, item.type)} type="button" variant="secondary">
                    <i className="bi bi-plus-lg"></i>
                  </Button>
                </div>
              )}
            </div>
            <div className="vstack gap-3">
              {form[item.type].map((child, index) => (
                <ExcerptChildForm
                  child={child}
                  index={index}
                  isLoading={isLoading}
                  item={item}
                  key={index}
                  onAdd={addChild}
                  onChange={handleChildChange}
                  onRemove={removeChild}
                />
              ))}
            </div>
            <Text>{item.text}</Text>
          </div>
        );
      })}

      <div>
        <div className="row">
          <div className="col-auto align-self-center">
            <Label className="mb-0">Description</Label>
          </div>
          <div className="col align-self-center">
            <hr className="text-secondary" />
          </div>
          <div className="col-auto align-self-center">
            <Button
              disabled={isLoading}
              onClick={() => setShowRichTextEditor(!showRichTextEditor)}
              type="button"
              variant="secondary"
            >
              <i className="bi bi-pen"></i>
            </Button>
          </div>
        </div>
        <CustomEditor className={clsx('mt-2', !showRichTextEditor && 'd-none')} placeholder="Enter the description" />
        <Text>Description is optional.</Text>
      </div>

      <div>
        <Button className="mt-5 px-5" disabled={isLoading} isLoading={isLoading} type="submit" variant="primary">
          Save
        </Button>
      </div>
    </form>
  );
};

export default function ManageExcerpt({
  collection,
  excerpt,
  onBack,
}: {
  collection: ICollection | null;
  excerpt?: null | Partial<IExcerpt>;
  onBack?: () => void;
}) {
  const [type, setType] = useState<'add' | 'edit' | null>(excerpt?.id ? 'edit' : 'add');

  function handleBack() {
    onBack?.();
  }

  function onClickType(type: 'add' | 'edit') {
    setType(type);
  }

  return (
    <LexicalProvider>
      <Card className="border">
        <CardHeader className="hstack gap-2 justify-content-between">
          {type === 'edit' ? (
            <div>
              {excerpt?.icon ? (
                <Image
                  alt="Icon"
                  className="object-fit-cove rounded"
                  height={30}
                  priority
                  src={excerpt.icon}
                  width={30}
                />
              ) : (
                <div
                  className="text-center"
                  style={{
                    height: 28,
                    width: 28,
                  }}
                >
                  <i className="bi bi-image fs-2 text-secondary"></i>
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}

          <div>
            <ButtonGroup>
              <Button
                onClick={handleBack}
                outline="secondary"
                size="sm"
                startContent={<i className="bi bi-arrow-left me-1"></i>}
              >
                Back
              </Button>

              <Button
                className={clsx(type === 'add' && 'active')}
                onClick={() => onClickType('add')}
                outline="secondary"
                size="sm"
                startContent={<i className="bi bi-plus-lg me-1"></i>}
              >
                Add
              </Button>

              {!!excerpt?.id && (
                <Button
                  className={clsx(type === 'edit' && 'active')}
                  onClick={() => onClickType('edit')}
                  outline="secondary"
                  size="sm"
                  startContent={<i className="bi bi-pencil-square me-1"></i>}
                >
                  Edit
                </Button>
              )}
            </ButtonGroup>
          </div>
        </CardHeader>
        <CardBody>
          <SaveExcerpt collection={collection} excerpt={excerpt || {}} isUpdate={type === 'edit'} />
        </CardBody>
      </Card>
    </LexicalProvider>
  );
}
