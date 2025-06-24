import React from "react";
import "../styles/ConfirmDialog.css";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;
  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <div className="confirm-header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-body">
          {message.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
        <div className="confirm-footer">
          <button className="btn btn-cancel" onClick={onCancel}>
            Hủy
          </button>
          <button className="btn btn-confirm" onClick={onConfirm}>
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}
