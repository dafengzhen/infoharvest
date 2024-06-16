import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl">
          404
        </h1>
        <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl">
          Not Found
        </p>
        <p className="mb-4 text-lg font-light text-muted-foreground">
          Could not find requested resource.
        </p>

        <Button>
          <a href="/">Back to Homepage</a>
        </Button>
      </div>
    </div>
  );
}
