import type { IError } from '@/app/interfaces';
import type { ICollection, ISaveCollectionDto } from '@/app/interfaces/collection';
import type { ChangeEvent, FormEvent } from 'react';

import { useFetchCollections, useSaveCollection } from '@/app/apis/collections';
import { getQueryClient } from '@/app/get-query-client';
import useToast from '@/app/hooks/toast';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Input, Label, Text } from 'bootstrap-react-logic';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface ISaveCollectionFormDto extends ISaveCollectionDto {
  children: Omit<ISaveCollectionFormDto, 'children'>[];
}

const initializeForm = (collection: Partial<ICollection>, isUpdate = false): ISaveCollectionFormDto => {
  if (!isUpdate) {
    return { children: [], id: undefined, name: '', order: 0 };
  }

  return {
    children: collection.children?.map(({ id, name = '', order = 0 }) => ({ id, name, order })) ?? [],
    id: collection.id,
    name: collection.name ?? '',
    order: collection.order,
  };
};

const InputField = ({ label, text, ...props }: { [_: string]: unknown; label: string; text?: string }) => (
  <div>
    <Label>{label}</Label>
    <Input {...props} />
    {text && <Text>{text}</Text>}
  </div>
);

const CollectionChildForm = ({
  child,
  index,
  isLoading,
  onAdd,
  onChange,
  onRemove,
}: {
  child: Omit<ISaveCollectionFormDto, 'children'>;
  index: number;
  isLoading: boolean;
  onAdd: (index?: number) => void;
  onChange: (index: number, key: keyof ISaveCollectionFormDto, value: number | string) => void;
  onRemove: (index: number) => void;
}) => (
  <div className="row">
    <div className="col">
      <Card cardBody className="border vstack gap-3">
        <InputField
          disabled={isLoading}
          label="Child Name"
          name="name"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(index, 'name', e.target.value)}
          placeholder="Enter the name"
          type="text"
          value={child.name}
        />

        <InputField
          disabled={isLoading}
          label="Child Order"
          min={0}
          minLength={1}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(index, 'order', parseInt(e.target.value))}
          placeholder="Enter the order"
          type="number"
          value={child.order}
        />
      </Card>
    </div>
    <div className="col-auto align-self-center">
      <Button disabled={isLoading} onClick={() => onAdd(index)} type="button" variant="secondary">
        <i className="bi bi-plus-lg"></i>
      </Button>
      <Button className="ms-2" disabled={isLoading} onClick={() => onRemove(index)} type="button" variant="secondary">
        <i className="bi bi-dash-lg"></i>
      </Button>
    </div>
  </div>
);

const SaveCollection = ({ collection, isUpdate }: { collection: Partial<ICollection>; isUpdate?: boolean }) => {
  const [form, setForm] = useState<ISaveCollectionFormDto>(initializeForm(collection, isUpdate));

  const toastRef = useToast();

  const saveCollectionMutation = useSaveCollection();

  const isLoading = saveCollectionMutation.isPending;

  useEffect(() => {
    setForm(initializeForm(collection, isUpdate));
  }, [collection, isUpdate]);

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    if (!form.name.trim()) {
      toast.showToast('Collection name cannot be empty', 'danger');
      return;
    }

    try {
      await saveCollectionMutation.mutateAsync(form);

      if (!isUpdate) {
        setForm(initializeForm({}, false));
      }

      toast.showToast('Saved successfully', 'success');

      void refreshQuery();
    } catch (error) {
      toast.showToast((error as IError).message, 'danger');
    }
  }

  async function refreshQuery() {
    void getQueryClient().refetchQueries({ predicate: (query) => query.queryKey.includes(useFetchCollections.key) });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleChildChange(index: number, key: keyof ISaveCollectionFormDto, value: number | string) {
    setForm((prev) => ({
      ...prev,
      children: prev.children.map((child, i) => (i === index ? { ...child, [key]: value } : child)),
    }));
  }

  function addChild(index?: number) {
    setForm((prev) => {
      const newChild = { name: '', order: 0 };
      const newChildren = [...prev.children];

      if (index !== undefined && index >= 0 && index <= newChildren.length) {
        newChildren.splice(index, 0, newChild);
      } else {
        newChildren.push(newChild);
      }

      return { ...prev, children: newChildren };
    });
  }

  function removeChild(index: number) {
    setForm((prev) => ({ ...prev, children: prev.children.filter((_, i) => i !== index) }));
  }

  return (
    <form className="vstack gap-3" onSubmit={handleSave}>
      {typeof collection?.id === 'number' && (
        <div>
          <Label>Selected Collection</Label>
          <div className="hstack gap-1 px-075 py-037 text-secondary rounded border text-bg-secondary bg-opacity-10 cursor-not-allowed">
            <div className="hstack gap-1">
              <i className="bi bi-folder"></i>
              {collection.name}
            </div>
          </div>
        </div>
      )}

      <InputField
        autoFocus
        disabled={isLoading}
        label="Collection Name"
        name="name"
        onChange={handleChange}
        placeholder="Enter the name"
        text="Collections assist in structuring information, making navigation more intuitive and efficient."
        type="text"
        value={form.name}
      />

      <InputField
        disabled={isLoading}
        label="Collection Order"
        min={0}
        minLength={1}
        name="order"
        onChange={handleChange}
        placeholder="Enter the order"
        text="The minimum order value is 0, and the default sorting is descending."
        type="number"
        value={form.order}
      />

      <div>
        <div className="row">
          <div className="col-auto align-self-center">
            <Label className="mb-0">Collection Children</Label>
          </div>
          <div className="col align-self-center">
            <hr className="text-secondary" />
          </div>

          {form.children.length === 0 && (
            <div className="col-auto align-self-center">
              <Button disabled={isLoading} onClick={() => addChild()} type="button" variant="secondary">
                <i className="bi bi-plus-lg"></i>
              </Button>
            </div>
          )}
        </div>
        <div className="vstack gap-3">
          {form.children.map((child, index) => (
            <CollectionChildForm
              child={child}
              index={index}
              isLoading={isLoading}
              key={index}
              onAdd={addChild}
              onChange={handleChildChange}
              onRemove={removeChild}
            />
          ))}
        </div>
        <Text>Manage child collections efficiently by adding or removing them as needed.</Text>
      </div>

      <div>
        <Button className="mt-5 px-5" disabled={isLoading} isLoading={isLoading} type="submit" variant="primary">
          Save
        </Button>
      </div>
    </form>
  );
};

export default function ManageCollection({
  collection,
  onBack,
}: {
  collection?: null | Partial<ICollection>;
  onBack?: () => void;
}) {
  const [type, setType] = useState<'add' | 'edit' | null>(collection?.id ? 'edit' : 'add');

  function handleBack() {
    onBack?.();
  }

  function onClickType(type: 'add' | 'edit') {
    setType(type);
  }

  return (
    <Card className="border">
      <CardHeader className="text-end">
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

          {!!collection?.id && (
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
      </CardHeader>
      <CardBody>
        <SaveCollection collection={collection || {}} isUpdate={type === 'edit'} />
      </CardBody>
    </Card>
  );
}
