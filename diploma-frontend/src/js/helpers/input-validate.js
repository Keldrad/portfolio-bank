import { el } from 'redom';

export default function inputValidate(input, rules) {
  input.value = input.value.trim();

  const { value } = input;

  const errorMessage = [];

  if (/^0.(0+)?$/.test(value)) {
    errorMessage.push('Сумма должна быть больше нуля');
  }

  if (value.length === 0) {
    errorMessage.push('Поле должно быть заполнено');
  }

  if (rules === 'login') {
    if (value.length > 0 && value.length < 6) {
      errorMessage.push('Введено менее 6 символов');
    }
    if (value.includes(' ')) {
      errorMessage.push('Поле содержит пробел');
    }
  }

  const prevErrorMessage = input.parentElement.querySelector(
    '.input-error-message'
  );
  if (prevErrorMessage) {
    prevErrorMessage.remove();
  }
  if (errorMessage.length > 0) {
    input.classList.add('input-error');
    input.after(el('span.input-error-message', `${errorMessage.join(', ')}`));
    return false;
  }

  return true;
}
