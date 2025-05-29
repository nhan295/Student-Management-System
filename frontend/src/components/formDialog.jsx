import React from 'react';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">{title}</div>
        <div className="modal-body">
          {message.split("\n").map((line, idx) => (
            <p key={idx} style={{ margin: 0 }}>{line}</p>
          ))}
        </div>
        <div className="modal-footer">
          <button onClick={onCancel}>Hủy</button>
          <button
            onClick={onConfirm}
            style={{ backgroundColor: '#1976d2', color: '#fff' }}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}