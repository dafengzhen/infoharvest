'use client';

export default function Collections() {
  return (
    <div className="px-2 py-4">
      <div className="card bg-base-100 border shadow">
        <div className="card-body">
          <div className="flex justify-between">
            <div className="w-1/4">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search"
                  className="input input-bordered"
                />
              </div>
            </div>
            <div className="grow text-end">
              <button className="btn btn-wide normal-case btn-primary">
                New Collection
              </button>
            </div>
          </div>
          <div className="overflow-x-auto my-4 min-h-full">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-sm">Name</th>
                  <th className="text-sm">Subset</th>
                  <th className="text-sm">Created</th>
                  <th className="text-sm">Options</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a className="link link-hover link-neutral">Cy Ganderton</a>
                  </td>
                  <td>
                    <div className="flex space-x-4">
                      <div className="badge rounded badge-neutral border-0">
                        neutral
                      </div>
                    </div>
                  </td>
                  <td>Cy Ganderton</td>
                  <td>
                    <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
                      <label tabIndex={0} className="btn btn-sm btn-ghost">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-5 h-5 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          ></path>
                        </svg>
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <a>Item 1</a>
                        </li>
                        <li>
                          <a>Item 2</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="my-4 mt-12 text-center">...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
