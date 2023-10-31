'use client';

import { ChangeEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { IToken } from '@/app/interface';
import clsx from 'clsx';
import { nanoid } from 'nanoid';

export interface IToast {
  id: string;
  message: string;
  type: 'warning' | 'info';
}

export default function Login() {
  const [expandToLearnMore, setExpandToLearnMore] = useState(false);
  const [toasts, setToasts] = useState<IToast[]>([]);
  const [form, setForm] = useState<{
    username: string;
    password: string;
  }>({
    username: '',
    password: '',
  });

  const loginMutation = useMutation({
    mutationFn: async (variables) => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_SERVER + '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(variables),
        },
      );
      return (await response.json()) as IToken;
    },
  });

  async function onClickLogin() {
    try {
      const { username, password } = form;
      const _username = username.trim();
      const _password = password.trim();
      if (!_username) {
        addToast({
          type: 'warning',
          message: 'login',
        });
        return;
      }
    } catch (e) {
    } finally {
    }
  }

  function addToast(toast: Omit<IToast, 'id'>) {
    setToasts([...toasts, { ...toast, id: nanoid() }]);
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
    <>
      <div className="hero min-h-screen bg-base-100">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
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
                  <a href="#" className="label-text-alt link link-hover">
                    Still not registered?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button
                  onClick={onClickLogin}
                  type="submit"
                  className="btn btn-primary"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="pt-6">
              infoharvest is a bookmarking tool that enables users to collect
              and store interesting online content for easy access and
              management
            </p>

            {expandToLearnMore && (
              <ul className="prose pt-3">
                <li className="px-0">
                  1. infoharvest tool is open source and free
                </li>
                <li className="px-0">
                  2. infoharvest does not have a backend management system, so
                  you don't need to worry, and it also provides private
                  deployment
                </li>
                <li className="px-0">
                  3. The browser bookmarks are too simple, but infoharvest is
                  just right
                </li>
              </ul>
            )}

            <button
              onClick={onClickExpandToLearnMore}
              className="my-2 btn btn-link normal-case px-0"
            >
              {expandToLearnMore ? 'Collapse' : 'Expand to learn more'}
            </button>
          </div>
        </div>
      </div>
      <div className="toast toast-top toast-center top-16">
        {toasts.map((item) => {
          return (
            <div
              key={item.id}
              className={clsx('alert', {
                'alert-warning': item.type === 'warning',
                'alert-info': item.type === 'info',
              })}
            >
              <span>{item.message}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
