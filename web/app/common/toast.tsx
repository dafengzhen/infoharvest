import clsx from 'clsx';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { nanoid } from 'nanoid';

export interface IToast {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'error';
  duration?: number;
}

export interface IToastRef {
  showToast: (
    toast: Omit<IToast, 'id' | 'message'> & { message: string | string[] },
  ) => string;
  hideToast: (toast: Pick<IToast, 'id' | 'message'>) => void;
}

export default forwardRef(function Toast(props, ref) {
  const [toasts, setToasts] = useState<IToast[]>([]);
  const toastsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    toasts
      .filter((value) => typeof value.duration === 'number')
      .forEach((value) => {
        setTimeout(() => {
          setToasts((prevState) =>
            prevState.filter((toast) => toast.id !== value.id),
          );
        }, value.duration);
      });
  }, [toasts]);

  useImperativeHandle(ref, () => ({
    showToast: addToast,
    hideToast: removeToast,
  }));

  function addToast(
    toast: Omit<IToast, 'id' | 'message'> & { message: string | string[] },
  ) {
    const _ids: string[] = [];
    const _toasts: IToast[] = [];
    if (typeof toast.message === 'string') {
      const id = nanoid();
      _ids.push(id);
      _toasts.push({
        id,
        type: toast.type,
        message: toast.message,
        duration: toast.duration,
      });
    } else if (Array.isArray(toast.message)) {
      toast.message
        .map((msg) => {
          return { ...toast, id: nanoid(), message: msg };
        })
        .forEach((item) => {
          _ids.push(item.id);
          _toasts.push(item);
        });
    }

    setToasts((prevState) => prevState.concat(_toasts));
    return _ids.length === 1 ? _ids[0] : _ids;
  }

  function removeToast(item: Pick<IToast, 'id' | 'message'>) {
    if (item.message) {
      setToasts(toasts.filter((toast) => toast.message !== item.message));
    } else {
      setToasts(toasts.filter((toast) => toast.id !== item.id));
    }
  }

  return (
    <div ref={toastsRef} className="toast toast-top toast-center top-16">
      {toasts.map((item) => {
        return (
          <div
            key={item.id}
            className={clsx('alert', {
              'alert-warning': item.type === 'warning',
              'alert-info': item.type === 'info',
              'alert-success': item.type === 'success',
              'alert-error': item.type === 'error',
            })}
          >
            <span>{item.message}</span>
            {typeof item.duration !== 'number' && (
              <button
                onClick={() => removeToast(item)}
                className="btn btn-ghost btn-circle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
});
