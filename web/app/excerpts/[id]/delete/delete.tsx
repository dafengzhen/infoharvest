'use client';

import { useContext } from 'react';
import { GlobalContext } from '@/app/contexts';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { type IExcerpt } from '@/app/interfaces/excerpt';
import DeleteExcerptsAction from '@/app/actions/excerpts/delete-excerpts-action';

export default function DeleteExcerpt({ excerpt }: { excerpt: IExcerpt }) {
  const router = useRouter();
  const { toast, tagState } = useContext(GlobalContext);

  const DeleteExcerptsActionMutation = useMutation({
    mutationFn: DeleteExcerptsAction,
  });

  async function onClickConfirmDeletion() {
    try {
      await DeleteExcerptsActionMutation.mutateAsync({
        id: excerpt.id,
        skipRevalidation: true,
      });

      const [_, setTag] = tagState ?? [];
      setTag?.('excerpts');

      toast.current.showToast({
        type: 'success',
        message: 'Deletion completed',
        duration: 1500,
      });
    } catch (e: any) {
      DeleteExcerptsActionMutation.reset();
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
            <div>Delete ⌈ID.&nbsp;{excerpt.id}⌋ excerpt</div>
            <ul className="mt-10">
              {excerpt.names.map((item) => {
                return (
                  <li className="my-4 text-base font-normal" key={item.id}>
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </h1>
          <div className="py-10 animate__animated animate__fast animate__fadeIn">
            <ul className="">
              <li className="my-2">
                The deletion of a excerpt implies that the associated data
                related to the excerpt will also be removed
              </li>
              <li className="my-2">
                Pressing the confirmation delete button will initiate the
                deletion process directly, without any further confirmation!
              </li>
              <li
                className={clsx('font-bold', {
                  'text-error': DeleteExcerptsActionMutation.isPending,
                })}
              >
                Please do not close this page and wait for the operation to
                complete
              </li>
            </ul>
          </div>
          <button
            disabled={
              DeleteExcerptsActionMutation.isPending ||
              DeleteExcerptsActionMutation.isSuccess
            }
            onClick={onClickConfirmDeletion}
            className="btn btn-error normal-case"
          >
            {DeleteExcerptsActionMutation.isPending && (
              <span className="loading loading-spinner"></span>
            )}
            <span>
              {DeleteExcerptsActionMutation.isSuccess ? (
                'Successfully deleted'
              ) : (
                <>
                  {DeleteExcerptsActionMutation.isPending
                    ? 'Processing'
                    : 'Confirm deletion'}
                </>
              )}
            </span>
          </button>
          {DeleteExcerptsActionMutation.isSuccess && (
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
