import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <div className="navbar sticky top-0 z-50 border-b bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/60">
      <div className="flex-none">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/">Dashboard</Link>
            </li>
            <li>
              <Link href="/collections">Collection</Link>
            </li>
          </ul>
        </div>
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          infoharvest
        </Link>
      </div>
      <div className="flex-1 hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            <Link href="/collections">Collection</Link>
          </li>
        </ul>
      </div>
      <div className="flex-none navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="mask mask-hexagon">
              <Image src="/avatar.png" alt="avatar" width={56} height={56} />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">dafengzhen</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <Link href="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
