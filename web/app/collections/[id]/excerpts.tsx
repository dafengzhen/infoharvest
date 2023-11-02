'use client';

import { useContext, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import { useMutation } from '@tanstack/react-query';
import { type ICollection } from '@/app/interfaces/collection';
import DeleteCollectionsAction from '@/app/actions/collections/delete-collections-action';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Excerpts({ collection }: { collection: ICollection }) {
  const router = useRouter();
  const { toast, tagState } = useContext(GlobalContext);
  const [search, setSearch] = useState('');

  const deleteCollectionsActionMutation = useMutation({
    mutationFn: DeleteCollectionsAction,
  });

  async function onClickConfirmDeletion() {
    try {
      toast.current.showToast({
        type: 'success',
        message: 'Deletion completed',
        duration: 1500,
      });
    } catch (e: any) {
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, delete failed'],
      });
    }
  }

  function onClickReturn() {
    router.back();
  }

  return (
    <div className="px-2 py-4">
      <div className="card bg-base-100 border shadow">
        <div className="card-body">
          <div className="flex space-x-4">
            <div className="w-1/6">
              <ul className="menu lg:min-w-max bg-base-200 rounded-box">
                <li>
                  <a>Solutions</a>
                  <ul>
                    <li>
                      <a>Design</a>
                    </li>
                    <li>
                      <a>Development</a>
                    </li>
                    <li>
                      <a>Hosting</a>
                    </li>
                    <li>
                      <a>Domain register</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>Enterprise</a>
                  <ul>
                    <li>
                      <a>CRM software</a>
                    </li>
                    <li>
                      <a>Marketing management</a>
                    </li>
                    <li>
                      <a>Security</a>
                    </li>
                    <li>
                      <a>Consulting</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>Products</a>
                  <ul>
                    <li>
                      <a>UI Kit</a>
                    </li>
                    <li>
                      <a>Wordpress themes</a>
                    </li>
                    <li>
                      <a>Wordpress plugins</a>
                    </li>
                    <li>
                      <a>Open source</a>
                      <ul>
                        <li>
                          <a>Auth management system</a>
                        </li>
                        <li>
                          <a>VScode theme</a>
                        </li>
                        <li>
                          <a>Color picker app</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>Company</a>
                  <ul>
                    <li>
                      <a>About us</a>
                    </li>
                    <li>
                      <a>Contact us</a>
                    </li>
                    <li>
                      <a>Privacy policy</a>
                    </li>
                    <li>
                      <a>Press kit</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="grow">
              <div className="flex items-center justify-between">
                <div className="w-1/4">
                  <div className="form-control">
                    <input
                      type="text"
                      name="search"
                      value={search}
                      placeholder="Search"
                      className="input input-bordered"
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>
                </div>
                <div className="grow text-end">
                  <Link
                    href="/excerpts/new"
                    className="btn btn-wide normal-case btn-primary"
                  >
                    New Excerpt
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Job</th>
                      <th>Favorite Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <th>1</th>
                      <td>Cy Ganderton</td>
                      <td>Quality Control Specialist</td>
                      <td>Blue</td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <th>2</th>
                      <td>Hart Hagerty</td>
                      <td>Desktop Support Technician</td>
                      <td>Purple</td>
                    </tr>
                    {/* row 3 */}
                    <tr>
                      <th>3</th>
                      <td>Brice Swyre</td>
                      <td>Tax Accountant</td>
                      <td>Red</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
