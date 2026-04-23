import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'تأكيد', danger = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary">
          إلغاء
        </button>
        <button onClick={onConfirm} className={danger ? 'btn-danger' : 'btn-primary'}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;