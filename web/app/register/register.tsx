'use client';

import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { GlobalContext } from '@/app/contexts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RegisterAction from '@/app/actions/register-action';

export default function Register() {
  const router = useRouter();
  const { toast } = useContext(GlobalContext);
  const [expandToLearnMore, setExpandToLearnMore] = useState(false);
  const [form, setForm] = useState<{
    username: string;
    password: string;
  }>({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (form.username === 'root') {
      setForm((prevState) => ({ ...prevState, password: '123456' }));
    }
  }, [form.username]);

  const registerMutation = useMutation({
    mutationFn: RegisterAction,
  });

  async function onClickRegister(e: FormEvent<HTMLFormElement>) {
    try {
      e.stopPropagation();
      e.preventDefault();

      const { username, password } = form;
      const _username = username.trim();
      const _password = password.trim();
      if (!_username) {
        toast.current.showToast({
          type: 'warning',
          message: 'Username cannot be empty',
          duration: 1500,
        });
        return;
      } else if (!_password) {
        toast.current.showToast({
          type: 'warning',
          message: 'Password cannot be empty',
          duration: 1500,
        });
        return;
      }

      const response = await registerMutation.mutateAsync({
        username,
        password,
      });

      toast.current.showToast({
        type: 'success',
        message: `Register completed, welcome ${response.username}`,
        duration: 1000,
      });

      setTimeout(() => {
        toast.current.showToast({
          type: 'success',
          message: 'Page will be refreshed soon',
          duration: 1500,
        });
      }, 500);

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (e: any) {
      registerMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, register failed'],
      });
    }
  }

  function onClickExpandToLearnMore() {
    setExpandToLearnMore(!expandToLearnMore);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value.trim() });
  }

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={onClickRegister}>
            {form.username === 'root' && form.password === '123456' && (
              <div className="alert mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-info shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>This is a built-in sample user</span>
              </div>
            )}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                disabled={
                  registerMutation.isPending || registerMutation.isSuccess
                }
                type="text"
                name="username"
                placeholder="username"
                className="input input-bordered"
                required
                onChange={onChange}
                value={form.username}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                disabled={
                  registerMutation.isPending || registerMutation.isSuccess
                }
                type="password"
                name="password"
                placeholder="password"
                className="input input-bordered"
                required
                onChange={onChange}
                value={form.password}
                autoComplete="password"
              />
              <label className="label">
                <Link href="/login" className="label-text-alt link link-hover">
                  Do you already have an account?
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              <button
                disabled={
                  registerMutation.isPending || registerMutation.isSuccess
                }
                type="submit"
                className="btn btn-primary normal-case"
              >
                {registerMutation.isPending && (
                  <span className="loading loading-spinner"></span>
                )}
                <span>
                  {registerMutation.isPending ? 'Loading' : 'Register'}
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="pt-6">
            infoharvest is a bookmarking tool that enables users to collect and
            store interesting online content for easy access and management
          </p>

          {expandToLearnMore && (
            <ul className="prose pt-3">
              <li className="px-0">
                1. infoharvest tool is open source and free
              </li>
              <li className="px-0">
                2. infoharvest does not have a backend management system, so you
                don't need to worry, and it also provides private deployment
              </li>
              <li className="px-0">
                3. The browser bookmarks are too simple, but infoharvest is just
                right
              </li>
              <li className="px-0">
                <Link
                  target="_blank"
                  href="https://github.com/dafengzhen/infoharvest"
                >
                  If helpful, please star it on GitHub to support and encourage
                </Link>
              </li>
            </ul>
          )}

          <Link
            href="/login"
            className="my-2 btn btn-link normal-case px-0 no-underline mr-3"
          >
            Login
          </Link>

          <button
            onClick={onClickExpandToLearnMore}
            className="my-2 btn btn-link normal-case px-0 no-underline"
          >
            {expandToLearnMore ? 'Collapse' : 'Expand to learn more'}
          </button>
        </div>
      </div>
    </div>
  );
}
