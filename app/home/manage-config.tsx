import type { IError } from '@/app/interfaces';
import type { IUpdateUserCustomConfigDto } from '@/app/interfaces/user';
import type { ChangeEvent, FormEvent } from 'react';

import { useFetchUserProfile, useUpdateUserCustomConfig } from '@/app/apis/users';
import { getQueryClient } from '@/app/get-query-client';
import { useUser } from '@/app/hooks';
import useToast from '@/app/hooks/toast';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Input, Label, Text } from 'bootstrap-react-logic';
import { useEffect, useState } from 'react';

interface ISaveConfigFormDto extends IUpdateUserCustomConfigDto {
  [key: string]: unknown;
}

const initializeForm = (dto: Partial<ISaveConfigFormDto>): ISaveConfigFormDto => {
  return {
    locked: dto.locked ?? false,
    type: dto.type ?? 'user',
    unlockPassword: dto.unlockPassword ?? '',
    wallpaper: dto.wallpaper ?? '',
  };
};

const InputField = ({ label, text, ...props }: { [_: string]: unknown; label: string; text?: string }) => (
  <div>
    <Label>{label}</Label>
    <Input {...props} />
    {text && <Text>{text}</Text>}
  </div>
);

const SaveConfig = () => {
  const [form, setForm] = useState<ISaveConfigFormDto>(initializeForm({}));

  const toastRef = useToast();
  const currentUser = useUser();

  const updateUserCustomConfigMutation = useUpdateUserCustomConfig(currentUser?.id);

  const isLoading = updateUserCustomConfigMutation.isPending;

  useEffect(() => {
    if (currentUser) {
      setForm(initializeForm(currentUser.customConfig));
    }
  }, [currentUser]);

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/i;
    if (form.wallpaper && !urlPattern.test(form.wallpaper)) {
      toast.showToast('Links are supported only for HTTP and HTTPS', 'danger');
      return;
    }

    try {
      await updateUserCustomConfigMutation.mutateAsync(form);

      toast.showToast('Saved successfully', 'success');

      void refreshQuery();
    } catch (error) {
      toast.showToast((error as IError).message, 'danger');
    }
  }

  async function refreshQuery() {
    void getQueryClient().refetchQueries({ predicate: (query) => query.queryKey.includes(useFetchUserProfile.key) });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <form className="vstack gap-3" onSubmit={handleSave}>
      {currentUser && (
        <div>
          <Label>Username</Label>
          <div className="hstack gap-1 px-075 py-037 text-secondary rounded border text-bg-secondary bg-opacity-10 cursor-not-allowed">
            <div className="hstack gap-1">
              <i className="bi bi-person-circle"></i>
              {currentUser.username}
            </div>
          </div>
        </div>
      )}

      <InputField
        disabled={isLoading}
        label="Wallpaper"
        name="Wallpaper"
        onChange={handleChange}
        placeholder="Enter the wallpaper"
        text="Set the URL for the wallpaper, supporting only Http and Https protocols."
        type="text"
        value={form.wallpaper}
      />

      <InputField
        disabled={isLoading}
        label="Unlock Password (Effective only for the homepage)"
        name="unlockPassword"
        onChange={handleChange}
        placeholder="Enter the password"
        text="Lock the homepage to prevent accidental touches; an unlock password is required for access."
        type="text"
        value={form.unlockPassword}
      />

      <div>
        <Button className="mt-5 px-5" disabled={isLoading} isLoading={isLoading} type="submit" variant="primary">
          Save
        </Button>
      </div>
    </form>
  );
};

export default function ManageConfig({ onBack }: { onBack?: () => void }) {
  function handleBack() {
    onBack?.();
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
        </ButtonGroup>
      </CardHeader>
      <CardBody>
        <SaveConfig />
      </CardBody>
    </Card>
  );
}
