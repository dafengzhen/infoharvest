'use client';

import { useContext } from 'react';
import { GlobalContext } from '@/app/contexts';
import { useMutation, useQuery } from '@tanstack/react-query';
import DeleteCollectionsAction from '@/app/actions/collections/delete-collections-action';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import FindOneCollectionsAction from '@/app/actions/collections/find-one-collections-action';

export default function DeleteCollection({ id }: { id: number }) {
  const router = useRouter();
  const { toast } = useContext(GlobalContext);

  const findOneCollectionsActionQuery = useQuery({
    queryKey: ['/collections', id],
    queryFn: () => FindOneCollectionsAction({ id }),
  });

  const deleteCollectionsActionMutation = useMutation({
    mutationFn: DeleteCollectionsAction,
  });

  async function onClickConfirmDeletion() {
    try {
      await deleteCollectionsActionMutation.mutateAsync({
        id,
      });

      toast.current.showToast({
        type: 'success',
        message: 'Deletion completed',
        duration: 1500,
      });
    } catch (e: any) {
      deleteCollectionsActionMutation.reset();
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
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="">
          <h1 className="text-5xl font-bold text-error">
            {findOneCollectionsActionQuery.data ? (
              <>
                Delete ⌈{findOneCollectionsActionQuery.data.name} ID.
                {id}⌋ collection
              </>
            ) : (
              <>
                Delete ⌈Loading ID.
                {id}⌋ collection
              </>
            )}
          </h1>
          <div className="py-10 animate__animated animate__fast animate__fadeIn">
            <ul>
              <li className="my-2">
                The deletion of a collection implies that the associated data
                related to the collection will also be removed
              </li>
              <li className="my-2">
                Pressing the confirmation delete button will initiate the
                deletion process directly, without any further confirmation!
              </li>
              <li
                className={clsx('font-bold', {
                  'text-error': deleteCollectionsActionMutation.isPending,
                })}
              >
                Please do not close this page and wait for the operation to
                complete
              </li>
            </ul>
          </div>
          <button
            disabled={
              deleteCollectionsActionMutation.isPending ||
              deleteCollectionsActionMutation.isSuccess
            }
            onClick={onClickConfirmDeletion}
            className="btn btn-error normal-case"
          >
            {deleteCollectionsActionMutation.isPending && (
              <span className="loading loading-spinner"></span>
            )}
            <span>
              {deleteCollectionsActionMutation.isSuccess ? (
                'Successfully deleted'
              ) : (
                <>
                  {deleteCollectionsActionMutation.isPending
                    ? 'Processing'
                    : 'Confirm deletion'}
                </>
              )}
            </span>
          </button>
          {deleteCollectionsActionMutation.isSuccess && (
            <button
              onClick={onClickReturn}
              className="btn normal-case ml-5 px-14"
            >
              Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
