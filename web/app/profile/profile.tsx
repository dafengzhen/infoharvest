'use client';

import Image from 'next/image';
import { IUser } from '@/app/interfaces/user';

export default function Profile({ user }: { user: IUser }) {
  const id = user.id;
  const username = user.username;
  const example = user.example ?? false;

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: 'url(avatar.png)',
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">
            {example ? (
              <div className="tooltip" data-tip="This is an example user">
                <div className="avatar offline">
                  <div className="mask mask-hexagon">
                    <Image
                      src="/avatar.png"
                      alt="avatar"
                      width={56}
                      height={56}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="tooltip" data-tip={`Welcome, ${username}`}>
                <div className="avatar online">
                  <div className="mask mask-hexagon">
                    <Image
                      src="/avatar.png"
                      alt="avatar"
                      width={56}
                      height={56}
                    />
                  </div>
                </div>
              </div>
            )}
          </h1>
          <p className="mb-5 text-lg font-bold cursor-default hover:text-warning">
            {`${username} (ID. ${id})`}
          </p>
        </div>
      </div>
    </div>
  );
}
