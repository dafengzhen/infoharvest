'use client';

import { type IHealth } from '@/app/interfaces';
import { useRouter } from 'next/navigation';

export default function Health({ data }: { data: IHealth }) {
  const router = useRouter();

  function onClickReturn() {
    router.back();
  }

  return (
    <div className="hero min-h-[90vh] bg-base-100">
      <div className="hero-content text-center">
        <div className="">
          <h1 className="text-5xl font-bold">STATUS {data.status}</h1>
          <p className="py-6 text-zinc-500 my-4">
            {data.status === 'UP' && (
              <span>
                The current server status is UP, and communication with the
                server is now possible
              </span>
            )}
          </p>
          <button
            onClick={onClickReturn}
            type="button"
            className="btn btn-primary normal-case"
          >
            Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
}
