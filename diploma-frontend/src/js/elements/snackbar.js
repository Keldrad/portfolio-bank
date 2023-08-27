import { el } from 'redom';
import { snackbarCloseButton } from '../svg-assets/svgs';

function closeSnackbar() {
  this.parentNode.remove();
}

function createCloseButton() {
  const closeButton = el('button.btn-reset.snackbar__close-button');
  closeButton.innerHTML = snackbarCloseButton;
  closeButton.addEventListener('click', closeSnackbar);
  return closeButton;
}

export default function createSnackbar(type, message) {
  const snackbar = el('p.snackbar');

  switch (type) {
    case 'error':
      snackbar.classList.add('snackbar_error');
      break;

    case 'warning':
      snackbar.classList.add('snackbar_warning');
      break;

    default:
      snackbar.classList.add('snackbar_info');
      break;
  }

  snackbar.textContent = message;
  snackbar.append(createCloseButton());

  return snackbar;
}
