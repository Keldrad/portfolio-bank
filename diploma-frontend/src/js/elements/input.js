import { el } from 'redom';

export default function createInput(role) {
  const input = el(`input#${role}.input`, {
    placeholder: 'Placeholder',
  });

  // only for dev time
  if (role === 'login') {
    input.value = 'developer';
  }
  if (role === 'password') {
    input.value = 'skillbox';
    input.type = 'password';
  }

  input.addEventListener('input', function errorClassClear() {
    this.classList.remove('input-error');
    const errorMessage = this.parentElement.querySelector(
      '.input-error-message'
    );
    if (errorMessage) {
      errorMessage.remove();
    }
  });
  return input;
}
