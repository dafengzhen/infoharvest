'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl">
          500
        </h1>
        <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl">
          Something went wrong
        </p>
        <p className="text-lg font-light text-muted-foreground">
          {error.message}
        </p>
        <p className="mb-4 text-lg font-light text-muted-foreground">
          {error.digest && <span>Digest: {error.digest}</span>}
        </p>

        <Button>
          <a href="/">Back to Homepage</a>
        </Button>
        <Button className="ml-4" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
