'use client';

import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { GlobalContext } from '@/app/contexts';
import AccountRemovalAction from '@/app/actions/account-removal-action';
import clsx from 'clsx';

export default function AccountRemoval() {
  const { toast } = useContext(GlobalContext);

  const AccountRemovalMutation = useMutation({
    mutationFn: AccountRemovalAction,
  });

  async function onClickConfirmDeletion() {
    try {
      await AccountRemovalMutation.mutateAsync();

      toast.current.showToast({
        type: 'success',
        message: 'Account removal completed',
        duration: 1000,
      });

      setTimeout((args) => {
        toast.current.showToast({
          type: 'success',
          message:
            'We look forward to meeting again. Thank you for using our services',
        });
      }, 1000);
    } catch (e: any) {
      AccountRemovalMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, delete failed'],
      });
    }
  }

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="">
          <h1 className="text-5xl font-bold text-error">Account removal</h1>
          <div className="py-10 prose text-start animate__animated animate__fast animate__bounceIn">
            <ol>
              <li className="my-2">
                All data related to the user will be permanently erased and
                cannot be recovered
              </li>
              <li className="my-2">
                Deletion should be done with caution. Once you press the confirm
                deletion button, the action will be irreversible
              </li>
              <li className="my-2">
                After pressing the confirm deletion button, the deletion process
                will begin. The speed of deletion will depend on the size of the
                data
              </li>
              <li
                className={clsx('font-bold', {
                  'text-error':
                    AccountRemovalMutation.isPending &&
                    !AccountRemovalMutation.isSuccess,
                })}
              >
                Please do not close this page and wait for the operation to
                complete
              </li>
            </ol>
          </div>
          <button
            disabled={
              AccountRemovalMutation.isPending ||
              AccountRemovalMutation.isSuccess
            }
            onClick={onClickConfirmDeletion}
            className={clsx('btn normal-case', {
              'btn-error': !AccountRemovalMutation.isSuccess,
              'btn-success': AccountRemovalMutation.isSuccess,
            })}
          >
            {AccountRemovalMutation.isSuccess ? (
              'Successfully deleted'
            ) : (
              <>
                {AccountRemovalMutation.isPending && (
                  <span className="loading loading-spinner"></span>
                )}
                <span>
                  {AccountRemovalMutation.isPending
                    ? 'Processing'
                    : 'Confirm deletion'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
