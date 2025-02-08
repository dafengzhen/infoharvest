import { CloseButton, Toast } from 'bootstrap-react-logic';
import clsx from 'clsx';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

export interface CustomToastHandle {
  hideToast: (id?: number) => void;
  showToast: (message: string, type?: 'danger' | 'primary' | 'success' | 'warning') => void;
}

export interface CustomToastProps {
  initialVisible?: boolean;
}

const CustomToast = forwardRef<CustomToastHandle, CustomToastProps>(({}, ref) => {
  const [options, setOptions] = useState<
    {
      id: number;
      message: string;
      type: 'danger' | 'primary' | 'success' | 'warning';
      visible: boolean;
    }[]
  >([]);

  useImperativeHandle(ref, () => ({
    hideToast: (id?: number) => {
      setOptions((prevState) =>
        prevState.map((option) =>
          id !== undefined
            ? option.id === id
              ? { ...option, visible: false }
              : option
            : { ...option, visible: false },
        ),
      );
    },
    showToast: (msg: string, msgType = 'primary') => {
      setOptions((prevState) => [
        ...prevState,
        { id: (prevState.at(-1)?.id ?? 0) + 1, message: msg, type: msgType, visible: true },
      ]);
    },
  }));

  const onVisibleChange = useCallback((visible: boolean, index: number) => {
    setOptions((prevState) => [
      ...prevState.slice(0, index),
      { ...prevState[index], visible },
      ...prevState.slice(index + 1),
    ]);
  }, []);

  return (
    <Toast
      container
      containerProps={{
        className: 'p-3 overflow-y-auto max-h-screen pointer-events-auto',
      }}
      options={options.map((item, index) => {
        return {
          body: item.message,
          header: (
            <>
              <div
                className={clsx('rounded', {
                  'bg-danger': item.type === 'danger',
                  'bg-primary': item.type === 'primary',
                  'bg-success': item.type === 'success',
                  'bg-warning': item.type === 'warning',
                })}
                style={{ height: 20, width: 20 }}
              />
              <strong className="ms-2 me-auto">PrepForge</strong>
              <CloseButton className="pointer-events-auto" onClick={() => onVisibleChange(!item.visible, index)} />
            </>
          ),
          id: item.id,
          onVisibleChange: (visible: boolean) => onVisibleChange(visible, index),
          role: 'alert',
          visible: item.visible,
        };
      })}
      placement="top-center"
      position="fixed"
    />
  );
});

CustomToast.displayName = 'CustomToast';

export default CustomToast;
