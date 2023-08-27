import { el } from 'redom';
import router from '../bundle/router';
import createSnackbar from './snackbar';

export default function createHeaderNavigate(activePage) {
  const atms = el('button.btn-reset.btn.btn-nav', 'Банкоматы');
  const accounts = el('button.btn-reset.btn.btn-nav', 'Счета');
  const currency = el('button.btn-reset.btn.btn-nav', 'Валюты');
  const exit = el('button.btn-reset.btn.btn-nav', 'Выход');

  atms.addEventListener('click', () => {
    router.navigate('/atms');
  });
  accounts.addEventListener('click', () => {
    router.navigate('/accounts');
  });
  currency.addEventListener('click', () => {
    router.navigate('/currency');
  });
  exit.addEventListener('click', () => {
    sessionStorage.removeItem('token');
    router.navigate('/');
  });

  switch (activePage) {
    case 'atms':
      atms.classList.add('btn-nav-act');
      break;
    case 'accounts':
      accounts.classList.add('btn-nav-act');
      break;
    case 'currency':
      currency.classList.add('btn-nav-act');
      break;

    default:
      createSnackbar('error', 'неизвестный адрес страницы');
      break;
  }
  return [atms, accounts, currency, exit];
}
