import { setChildren } from 'redom';
import createLoginModal from './pages/login';
import { renderAccountsList } from './pages/accounts';
import {
  createAccountSubheader,
  showAccountDetails,
} from './pages/account-details';
import {
  createCurrencySubheader,
  createCurrencyExchangeWrapper,
  startCurrencyMonitoring,
} from './pages/currency';
import {
  createAtmsHeader,
  createAtmsMapContainer,
  mapsInit,
} from './pages/atms';
import router from './bundle/router';
import createHeaderNavigate from './elements/header-navigate';
import { selectChoices } from './bundle/choices-options';

import '../css/normalize.css';
import '../css/root.css';
import '../css/glob.css';
import '../css/fonts.css';
import '../css/btns.css';
import '../css/inputs.css';
import '../css/header.css';
import '../css/login.css';
import '../css/form__line.css';
import '../css/snackbar.css';
import '../css/subheader.css';
import '../css/accounts.css';
import '../css/account-details.css';
import '../css/pagination.css';
import '../css/choices.min.css';
import '../css/custom-selects.css';
import '../css/currency.css';
import '../css/atms__map.css';
import '../css/autosuggest-list.css';
import '../css/spinner.css';

require('@babel/polyfill');

const navContainer = document.getElementById('nav-container');
const subContainer = document.getElementById('sub-container');
const appContainer = document.getElementById('app-container');

router.on('/', () => {
  setChildren(navContainer, []);
  setChildren(subContainer, []);
  setChildren(appContainer, createLoginModal());
});

router.on('/accounts', () => {
  setChildren(appContainer, []);
  setChildren(navContainer, createHeaderNavigate('accounts'));
  renderAccountsList();
});

router.on('/account/:id', ({ data: { id } }) => {
  setChildren(appContainer, []);
  setChildren(navContainer, createHeaderNavigate());
  setChildren(subContainer, createAccountSubheader(id));
  setChildren(appContainer, showAccountDetails(id));
});

router.on('/currency', () => {
  setChildren(appContainer, []);
  setChildren(navContainer, createHeaderNavigate('currency'));
  setChildren(subContainer, createCurrencySubheader());
  setChildren(appContainer, [createCurrencyExchangeWrapper()]);
  selectChoices();
  startCurrencyMonitoring();
});

router.on('/atms', () => {
  setChildren(appContainer, []);
  setChildren(navContainer, createHeaderNavigate('atms'));
  setChildren(subContainer, createAtmsHeader());
  setChildren(appContainer, createAtmsMapContainer());
  mapsInit();
});

router.resolve();

const token = sessionStorage.getItem('token');
if (!sessionStorage.getItem(token)) {
  router.navigate('/');
}
