import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="">
          <h1 className="text-5xl font-bold">Not Found!</h1>
          <p className="pt-6">Could not find requested resource</p>
          <div className="pt-6">
            <Link className="btn btn-error normal-case" href="/">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
