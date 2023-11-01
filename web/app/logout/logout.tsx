'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutAction from '@/app/actions/logout-action';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    LogoutAction().then(() => {
      setTimeout(() => {
        router.replace('/');
      }, 1500);
    });
  }, []);

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-info animate__animated animate__fast animate__bounceInLeft">
            Logging out ...
          </h1>
          <p className="py-6 animate__animated animate__fast animate__bounceInRight">
            Please wait a moment. After the logout is complete, the page will be
            refreshed
          </p>
        </div>
      </div>
    </div>
  );
}
