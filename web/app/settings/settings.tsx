'use client';

import { type ChangeEvent, type FormEvent, useContext, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import { useMutation } from '@tanstack/react-query';
import UpdateUserAction, {
  type IUpdateUserVariables,
} from '@/app/actions/update-user-action';
import { type IUser } from '@/app/interfaces/user';
import Link from 'next/link';

export default function Settings({ user }: { user: IUser }) {
  const { toast } = useContext(GlobalContext);
  const [form, setForm] = useState<{
    username: string;
    oldPassword: string;
    newPassword: string;
  }>({
    username: user.username,
    oldPassword: '',
    newPassword: '',
  });

  const updateUserMutation = useMutation({
    mutationFn: UpdateUserAction,
  });

  async function onClickUpdate(e: FormEvent<HTMLFormElement>) {
    try {
      e.stopPropagation();
      e.preventDefault();

      const variables: IUpdateUserVariables = {};

      const currentUsername = user.username;
      const username = form.username.trim();
      if (username && username !== currentUsername) {
        variables.username = username;
      }

      const oldPassword = form.oldPassword.trim();
      const newPassword = form.newPassword.trim();

      if (oldPassword && !newPassword) {
        toast.current.showToast({
          type: 'warning',
          message: 'Please enter a new password',
        });
        return;
      }

      if (newPassword && !oldPassword) {
        toast.current.showToast({
          type: 'warning',
          message: 'Please enter the old password',
        });
        return;
      }

      if (oldPassword && newPassword && oldPassword === newPassword) {
        toast.current.showToast({
          type: 'warning',
          message: 'The old password and the new password cannot be the same',
        });
        return;
      }

      if (oldPassword && newPassword) {
        variables.oldPassword = oldPassword;
        variables.newPassword = newPassword;
      }

      if (Object.keys(variables).length > 0) {
        await updateUserMutation.mutateAsync(variables);
      }

      toast.current.showToast({
        type: 'success',
        message: 'User profile update completed',
        duration: 1500,
      });
    } catch (e: any) {
      updateUserMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, update failed'],
      });
    }
  }

  function onChangeForm(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
  }

  return (
    <div className="px-2 py-4 mx-auto">
      <div className="card bg-base-100 border shadow">
        <form className="card-body" onSubmit={onClickUpdate}>
          <h2 className="card-title">Settings</h2>
          <p>set user profile</p>
          <div className="divider"></div>
          <div>
            <div className="form-control my-3">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                disabled={updateUserMutation.isPending}
                type="text"
                placeholder="username"
                className="input input-bordered"
                name="username"
                value={form.username}
                onChange={onChangeForm}
              />
              <label className="label">
                <span className="label-text-alt">
                  The username should be unique
                </span>
              </label>
            </div>
            <div className="form-control my-3">
              <label className="label">
                <span className="label-text">OldPassword</span>
              </label>
              <input
                disabled={updateUserMutation.isPending}
                type="password"
                placeholder="oldPassword"
                className="input input-bordered"
                autoComplete="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={onChangeForm}
              />
              <label className="label">
                <span className="label-text-alt">
                  Inputting the old password allows for password modification
                </span>
              </label>
            </div>
            <div className="form-control my-3">
              <label className="label">
                <span className="label-text">NewPassword</span>
              </label>
              <input
                disabled={updateUserMutation.isPending}
                type="password"
                placeholder="newPassword"
                className="input input-bordered"
                autoComplete="password"
                name="newPassword"
                value={form.newPassword}
                onChange={onChangeForm}
              />
              <label className="label">
                <span className="label-text-alt">
                  Modifying the password requires verifying the old password
                </span>
              </label>
            </div>
            <div className="form-control my-3">
              <label className="label">
                <span className="label-text">Account removal</span>
              </label>
              <label className="label">
                <span className="label-text-alt">
                  <Link
                    href={`/users/${user.id}/account-removal`}
                    className="link link-hover"
                  >
                    If you need to delete your account, please click here to
                    proceed!
                  </Link>
                </span>
              </label>
            </div>
          </div>
          <div className="card-actions mt-4">
            <button
              disabled={updateUserMutation.isPending}
              type="submit"
              className="btn btn-outline btn-success normal-case"
            >
              {updateUserMutation.isPending && (
                <span className="loading loading-spinner"></span>
              )}
              <span>{updateUserMutation.isPending ? 'Loading' : 'Update'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
