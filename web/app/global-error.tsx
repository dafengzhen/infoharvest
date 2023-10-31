'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="">
          <h1 className="text-5xl font-bold">Something went wrong!</h1>
          <p className="pt-6">{error.message}</p>
          {error.digest && <p className="pt-4">Digest: {error.digest}</p>}
          <div className="pt-6">
            <button onClick={reset} className="btn btn-error normal-case">
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
