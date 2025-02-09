'use client';

import { useLogin } from '@/app/apis/users';
import { useSetToken } from '@/app/hooks';
import useToast from '@/app/hooks/toast';
import { type IError } from '@/app/interfaces';
import { getPublicPath } from '@/app/tools';
import { Button, Card, Checkbox, Input, InputGroup, InputGroupText, Label } from 'bootstrap-react-logic';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { type ChangeEvent, type FormEvent, useState } from 'react';

const publicPath = getPublicPath();

const currentDate = new Date();

export default function Login() {
  const [form, setForm] = useState({ password: '', username: '' });
  const [eyeVisible, setEyeVisible] = useState(false);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const toastRef = useToast();
  const login = useLogin();
  const isLoading = login.isPending || login.isSuccess;
  const setToken = useSetToken();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    if (!isTermsAccepted) {
      toast.showToast('You must accept the Terms of Service and Privacy Policy', 'danger');
      return;
    }

    const { password, username } = form;

    if (!username.trim() || !password.trim()) {
      toast.showToast('Username and password cannot be empty', 'danger');
      return;
    }

    try {
      const response = await login.mutateAsync({ password: password.trim(), username: username.trim() });
      setToken(response.token);
      toast.showToast('Login successful', 'success');

      setTimeout(() => location.assign(publicPath + '/'), 1250);
    } catch (error) {
      toast.showToast((error as IError).message, 'danger');
    }
  }
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  }
  function togglePasswordVisibility() {
    setEyeVisible((prev) => !prev);
  }

  return (
    <div className="container d-grid vh-100 p-3" style={{ placeItems: 'center' }}>
      <Card cardBody className="shadow border-0" style={{ height: 580, width: 400 }}>
        <div className="text-center mt-4 mb-5">
          <Link href="./">
            <Image
              alt="infoharvest"
              className="rounded-circle img-thumbnail"
              height={70}
              priority
              src={publicPath + '/images/logo.png'}
              width={70}
            />
          </Link>
        </div>

        <form className="d-flex flex-column gap-3" onSubmit={handleLogin}>
          <InputGroup>
            <InputGroupText className="justify-content-end" style={{ width: 100 }}>
              Username
            </InputGroupText>
            <Input
              autoComplete="username"
              autoFocus
              disabled={isLoading}
              name="username"
              onChange={handleInputChange}
              placeholder="Please enter"
              type="text"
            />
          </InputGroup>

          <InputGroup>
            <InputGroupText className="justify-content-end" style={{ width: 100 }}>
              Password
            </InputGroupText>
            <Input
              autoComplete="current-password"
              disabled={isLoading}
              endContent={
                <i
                  className={clsx('bi cursor-pointer', eyeVisible ? 'bi-eye text-primary' : 'bi-eye-slash')}
                  onClick={togglePasswordVisibility}
                />
              }
              name="password"
              onChange={handleInputChange}
              placeholder="Please enter"
              startEndContentClasses={{
                component: (originalClass) => clsx(originalClass, 'rounded-start-0'),
                container: (originalClass) => clsx(originalClass, 'flex-grow-1'),
              }}
              type={eyeVisible ? 'text' : 'password'}
            />
          </InputGroup>

          <Button className="mt-5" disabled={isLoading} isLoading={login.isPending} type="submit" variant="primary">
            Login / Register
          </Button>

          <div className="form-check">
            <Checkbox
              checked={isTermsAccepted}
              disabled={isLoading}
              id="terms-and-privacy-checkbox"
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <Label
              className="user-select-none text-secondary cursor-pointer"
              formCheckLabel
              htmlFor="terms-and-privacy-checkbox"
            >
              I have read and agree to the Terms of Service and Privacy Policy
            </Label>
          </div>
        </form>

        <p className="text-center small text-body-tertiary position-absolute bottom-0 start-50 translate-middle-x">
          {`Copyright (c) ${currentDate.getFullYear()} Infoharvest`}
        </p>
      </Card>
    </div>
  );
}
