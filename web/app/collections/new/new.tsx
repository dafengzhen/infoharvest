'use client';

import { useMutation } from '@tanstack/react-query';
import CreateCollectionsAction from '@/app/actions/collections/create-collections-action';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '@/app/contexts';

export default function CreateCollection() {
  const router = useRouter();
  const { toast } = useContext(GlobalContext);
  const [form, setForm] = useState<{
    name: string;
  }>({
    name: '',
  });

  const createCollectionsActionMutation = useMutation({
    mutationFn: CreateCollectionsAction,
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.stopPropagation();
      e.preventDefault();

      const { name } = form;
      const _name = name.trim();
      if (!_name) {
        toast.current.showToast({
          type: 'warning',
          message: 'The name of the collection cannot be empty',
        });
        return;
      }

      await createCollectionsActionMutation.mutateAsync({
        name: _name,
      });

      toast.current.showToast({
        type: 'success',
        message: 'Successfully created a collection',
        duration: 1000,
      });

      setTimeout(() => {
        router.push('/collections');
      }, 1500);
    } catch (e: any) {
      createCollectionsActionMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, create failed'],
      });
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
  }

  return (
    <div className="px-2 py-4 mx-auto">
      <form className="card bg-base-100 border shadow" onSubmit={onSubmit}>
        <div className="card-body">
          <h2 className="card-title">Collection</h2>
          <p>create a new collection</p>
          <div className="divider"></div>
          <div>
            <div className="form-control my-3">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                disabled={
                  createCollectionsActionMutation.isPending ||
                  createCollectionsActionMutation.isSuccess
                }
                type="text"
                name="name"
                value={form.name}
                placeholder="name"
                className="input input-bordered"
                onChange={onChange}
              />
              <label className="label">
                <span className="label-text-alt">
                  Please enter the name of the collection
                </span>
              </label>
            </div>
          </div>
          <div className="card-actions mt-4">
            <button
              disabled={
                createCollectionsActionMutation.isPending ||
                createCollectionsActionMutation.isSuccess
              }
              type="submit"
              className="btn btn-outline btn-success normal-case"
            >
              {createCollectionsActionMutation.isPending && (
                <span className="loading loading-spinner"></span>
              )}
              <span>
                {createCollectionsActionMutation.isPending ? 'Loading' : 'Save'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
