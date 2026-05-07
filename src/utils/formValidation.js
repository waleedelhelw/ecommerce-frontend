export const showValidationFeedback = (
  message = 'كمّل البيانات المطلوبة الأول'
) => {
  requestAnimationFrame(() => {
    const firstInvalidField = document.querySelector('.input-error, [aria-invalid="true"]');
    const summary = document.getElementById('validation-summary');
    const target = summary || firstInvalidField;

    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (firstInvalidField && typeof firstInvalidField.focus === 'function') {
      firstInvalidField.focus({ preventScroll: true });
    }
  });

  return message;
};
