'use client';

import { useContext, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import { useMutation } from '@tanstack/react-query';
import { type ICollection } from '@/app/interfaces/collection';
import DeleteCollectionsAction from '@/app/actions/collections/delete-collections-action';
import { useRouter } from 'next/navigation';
import Excerpts from '@/app/excerpts/excerpts';
import { type IPage } from '@/app/interfaces';
import { type IExcerpt } from '@/app/interfaces/excerpt';

export default function CollectionId({
  collection,
  data,
}: {
  collection: ICollection;
  data: IPage<IExcerpt[]>;
}) {
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
            <div className="w-5/6">
              <Excerpts collection={collection} data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
