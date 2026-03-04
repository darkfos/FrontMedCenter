import React, { useEffect } from 'react';
import { X, Info, CheckCircle, AlertCircle } from 'lucide-react';
import './InfoModal.css';

const ICONS = {
  info: Info,
  success: CheckCircle,
  error: AlertCircle,
};

export default function InfoModal({ isOpen, title, message, variant = 'info', onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const Icon = ICONS[variant] || Info;

  return (
    <div
      className={`info-modal-overlay ${isOpen ? 'info-modal-overlay_active' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
      aria-describedby="info-modal-message"
    >
      <div
        className={`info-modal info-modal_${variant}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="info-modal__header">
          <div className="info-modal__title-wrap">
            <Icon className="info-modal__icon" size={22} />
            <h2 id="info-modal-title" className="info-modal__title">
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="info-modal__close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
        </div>
        <div id="info-modal-message" className="info-modal__message">
          {message.split('\n').map((line, i) => (
            <p key={i}>{line || '\u00A0'}</p>
          ))}
        </div>
        <div className="info-modal__actions">
          <button
            type="button"
            className="info-modal__btn info-modal__btn_primary"
            onClick={onClose}
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
