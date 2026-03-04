import React, { createContext, useContext, useState, useCallback } from 'react';
import InfoModal from '../components/InfoModal/InfoModal';

const InfoModalContext = createContext(null);

export function InfoModalProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info', // 'info' | 'success' | 'error'
  });

  const openInfo = useCallback(({ title = 'Информация', message = '', variant = 'info' } = {}) => {
    setState({
      isOpen: true,
      title: title || 'Информация',
      message: typeof message === 'string' ? message : String(message),
      variant: variant === 'success' || variant === 'error' ? variant : 'info',
    });
  }, []);

  const closeInfo = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <InfoModalContext.Provider value={{ openInfo, closeInfo }}>
      {children}
      <InfoModal
        isOpen={state.isOpen}
        title={state.title}
        message={state.message}
        variant={state.variant}
        onClose={closeInfo}
      />
    </InfoModalContext.Provider>
  );
}

export function useInfoModal() {
  const ctx = useContext(InfoModalContext);
  if (!ctx) {
    throw new Error('useInfoModal must be used within InfoModalProvider');
  }
  return ctx;
}
