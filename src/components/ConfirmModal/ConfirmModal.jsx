import "./ConfirmModal.css";

export function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = "Confirm" }) {
  return (
    <div className="confirm-modal__backdrop">
      <div className="confirm-modal card">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-modal__actions">
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
