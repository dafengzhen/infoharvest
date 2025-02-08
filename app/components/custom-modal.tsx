import type { ReactNode } from 'react';

import { Button, CloseButton, Modal } from 'bootstrap-react-logic';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

export interface CustomModalHandle {
  hideModal: () => void;
  showModal: (title: string, body: ReactNode, modalFooter: null | ReactNode) => void;
}

export interface CustomModalProps {
  initialVisible?: boolean;
}

const CustomModal = forwardRef<CustomModalHandle, CustomModalProps>(({ initialVisible = false }, ref) => {
  const [visible, setVisible] = useState(initialVisible);
  const [title, setTitle] = useState<string>('PrepForge');
  const [body, setBody] = useState<ReactNode>(null);
  const [footer, setFooter] = useState<ReactNode>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useImperativeHandle(ref, () => ({
    hideModal: () => {
      setVisible(false);
    },
    showModal: (modalTitle, modalBody, modalFooter) => {
      setTitle(modalTitle);
      setBody(() => modalBody);
      setFooter(() => modalFooter);
      setVisible(true);
    },
  }));

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleConfirm = useCallback(() => {
    setVisible(false);
  }, []);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    isInitialized && (
      <Modal
        body={body}
        centered
        footer={
          footer ? (
            footer
          ) : (
            <>
              <Button onClick={handleCancel} type="button" variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleConfirm} type="button" variant="primary">
                Confirm
              </Button>
            </>
          )
        }
        header={<CloseButton onClick={handleCancel} type="button" />}
        onVisibleChange={setVisible}
        tabIndex={-1}
        title={title}
        visible={visible}
      />
    )
  );
});

CustomModal.displayName = 'CustomModal';

export default CustomModal;
