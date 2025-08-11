// ConfirmContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Stack} from 'react-bootstrap';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    message: '',
    resolve: null,
    visible: false,
  });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({
        message,
        resolve,
        visible: true,
      });
    });
  }, []);

  const handleConfirm = () => {
    confirmState.resolve(true);
    setConfirmState({ ...confirmState, visible: false });
  };

  const handleCancel = () => {
    confirmState.resolve(false);
    setConfirmState({ ...confirmState, visible: false });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {confirmState.visible && (
        <div className="confirm-overlay">
          <div className="confirm-box m-3">
            <p>{confirmState.message}</p>
            <Stack direction="horizontal" gap={3} className='align-items-center justify-content-center'>
                <button onClick={handleConfirm} className='bg-success-custom text-white'>Yes</button>
                <button onClick={handleCancel} className='bg-danger-custom text-white'>Cancel</button>
            </Stack>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
