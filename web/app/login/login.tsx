'use client';

import {
  type ChangeEvent,
  type FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useMutation } from '@tanstack/react-query';
import { GlobalContext } from '@/app/contexts';
import LoginAction from '@/app/actions/login-action';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login({ type }: { type?: 'example' }) {
  const router = useRouter();
  const { toast } = useContext(GlobalContext);
  const [expandToLearnMore, setExpandToLearnMore] = useState(false);
  const [form, setForm] = useState<{
    username: string;
    password: string;
  }>({
    username: type === 'example' ? 'root' : '',
    password: type === 'example' ? '123456' : '',
  });

  useEffect(() => {
    if (form.username === 'root') {
      setForm((prevState) => ({ ...prevState, password: '123456' }));
    }
  }, [form.username]);

  const loginMutation = useMutation({
    mutationFn: LoginAction,
  });

  async function onClickLogin(e: FormEvent<HTMLFormElement>) {
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

      const response = await loginMutation.mutateAsync({
        username: _username,
        password: _password,
      });

      toast.current.showToast({
        type: 'success',
        message: `Login completed, welcome ${response.username}`,
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
      loginMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, login failed'],
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

  function onClickExampleUser() {
    if (form.username === 'root' && form.password === '123456') {
      setForm({ ...form, username: '', password: '' });
    } else {
      setForm({ ...form, username: 'root', password: '123456' });
    }
  }

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={onClickLogin}>
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
                disabled={loginMutation.isPending || loginMutation.isSuccess}
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
                disabled={loginMutation.isPending || loginMutation.isSuccess}
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
                <Link
                  className="label-text-alt link link-hover"
                  href="/register"
                >
                  Still not registered?
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              <button
                disabled={loginMutation.isPending || loginMutation.isSuccess}
                type="submit"
                className="btn btn-primary normal-case"
              >
                {loginMutation.isPending && (
                  <span className="loading loading-spinner"></span>
                )}
                <span>{loginMutation.isPending ? 'Loading' : 'Login'}</span>
              </button>
            </div>
          </form>
        </div>
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="pt-6">
            infoharvest is a bookmarking tool that enables users to collect and
            store interesting online content for easy access and management
          </p>
          <p className="pt-3">
            If you need to experience the demo user, please enter the account
            &nbsp;
            <span
              onClick={onClickExampleUser}
              className="underline cursor-pointer"
            >
              root
            </span>
            &nbsp; and the password is &nbsp;
            <span
              onClick={onClickExampleUser}
              className="underline cursor-pointer"
            >
              123456
            </span>
            &nbsp;
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
            href="/register"
            className="my-2 btn btn-link normal-case px-0 no-underline mr-3"
          >
            Register
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
