import { FiAlertCircle } from 'react-icons/fi';

const ValidationSummary = ({
  errors,
  title = 'راجع البيانات المطلوبة',
  message = 'فيه بيانات ناقصة أو غير صحيحة. كمّل الحقول المحددة باللون الأحمر.',
  className = '',
}) => {
  const errorMessages = Object.values(errors || {}).filter(Boolean);

  if (errorMessages.length === 0) return null;

  return (
    <div
      id="validation-summary"
      className={`rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <FiAlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold text-red-800">{title}</p>
          <p className="text-sm mt-1">{message}</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            {errorMessages.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidationSummary;
