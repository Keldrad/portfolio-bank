import { el, setChildren, mount, unmount } from 'redom';
import {
  apiGetUserCurrencies,
  apiCurrencyBuy,
  getChangedCurrency,
} from '../api/api';
import { selectChoices } from '../bundle/choices-options';
import { amountFormater, amountUnformat } from '../helpers/amountViewFormating';
import { inputAmountValueFormater } from '../helpers/inputFormater';
import createSnackbar from '../elements/snackbar';
import inputValidate from '../helpers/input-validate';
import createInput from '../elements/input';

export function createCurrencySubheader() {
  return el('h2.page-subheader.currency__subheader', 'Валютный обмен');
}

function createOwnCurrencyItem(code, amount) {
  const currencyItem = el('.own-currency__item');
  const currencuItemCode = el('.own-currency-item__code', code);
  const currencuItemDots = el('.with-dashed-border', '_');
  const currencuItemAmount = el(
    '.own-currency-item__amount',
    amountFormater(amount)
  );
  setChildren(currencyItem, [
    currencuItemCode,
    currencuItemDots,
    currencuItemAmount,
  ]);
  return currencyItem;
}

function createOwnCurrencyList(exchangeResult) {
  let apiCurrencies = new Promise((resolve) => {
    resolve(exchangeResult);
  });
  if (!exchangeResult) {
    const token = sessionStorage.getItem('token');
    apiCurrencies = apiGetUserCurrencies(token);
  }
  const ownCurrenciesList = el('ol.currencies-list');
  apiCurrencies.then((data) => {
    const currencies = data.payload;
    for (const key in currencies) {
      if (currencies[key].amount > 0) {
        mount(
          ownCurrenciesList,
          createOwnCurrencyItem(currencies[key].code, currencies[key].amount)
        );
      }
    }
  });

  return ownCurrenciesList;
}

export function createOwnCurrency() {
  const ownCurrency = el(
    '.own-currency.with-shadow.bord-radius-50px.padding-50px'
  );
  const ownCurrencyHeader = el('h3.mini-header', 'Ваши валюты');
  setChildren(ownCurrency, [
    ownCurrencyHeader,
    el('#own-currencies-container', [createOwnCurrencyList()]),
  ]);

  return ownCurrency;
}

export function createCurrencyExchange() {
  const currencyExchange = el(
    '.currency-exchange.with-shadow.bord-radius-50px.padding-50px'
  );
  const currencyExchangeHeader = el('h3.mini-header', 'Обмен валюты');

  const currenciesLine = el(
    '.change-currency__line.change-currency__line_currencies',
    [
      el('span.change-currency__text', 'Из'),
      el('select#from.input.change-currency-select'),
      el('span.change-currency__text', 'в'),
      el('select#to.input.change-currency-select'),
    ]
  );

  const amountInput = createInput('amount');
  amountInput.setAttribute('placeholder', '0');
  amountInput.setAttribute('autocomplete', 'off');
  amountInput.setAttribute('value', '');

  amountInput.addEventListener('input', inputAmountValueFormater);

  const amountLine = el('.change-currency__line.change-currency__line_amount', [
    el('span.change-currency__text.change-currency__text_amount', 'Сумма'),
    amountInput,
  ]);

  const exchangeButton = el(
    'button.btn-reset.btn.btn-primary.exchange-container__button',
    'Обменять'
  );

  exchangeButton.addEventListener('click', async () => {
    const token = sessionStorage.getItem('token');
    const from = document.getElementById('from');
    const to = document.getElementById('to');
    const amount = document.getElementById('amount');

    const amountValidateResult = inputValidate(amountInput, 'transfer');
    if (amountValidateResult) {
      try {
        const result = await apiCurrencyBuy(
          from.value,
          to.value,
          amountUnformat(amount.value),
          token
        );

        const ownCurrenciesContainer = document.getElementById(
          'own-currencies-container'
        );
        setChildren(ownCurrenciesContainer, createOwnCurrencyList(result));
        const parentNode = document.querySelector(
          '.change-currency__line_currencies'
        );
        const fromInput = document.querySelector('.choices');
        const revamped = el('select#from.input.change-currency-select');
        mount(parentNode, revamped, fromInput, true);
        selectChoices(result);
        amount.value = '';
      } catch (error) {
        const snackbar = createSnackbar('error', error.message);
        document.body.append(snackbar);
      }
    }
  });

  const exchangeDataContainer = el('.exchange-container__data', [
    currenciesLine,
    amountLine,
  ]);

  const exchangeContainer = el('.exchange-container', [
    exchangeDataContainer,
    exchangeButton,
  ]);

  setChildren(currencyExchange, [currencyExchangeHeader, exchangeContainer]);
  return currencyExchange;
}

function createMonitorLine(data) {
  const params = JSON.parse(data);
  const monitorLine = el('.currency-monitor__line');
  const currencyMonitorPair = el(
    'span.currency-monitor__pair-codes',
    `${params.from}/${params.to}`
  );
  const currencyMonitorDots = el('.with-dashed-border', '_');
  const currencyMonitorRate = el(
    'span.currency-monitor__amount',
    `${amountFormater(params.rate)}`
  );
  const currencyMonitorTriangle = el('.currency-monitor__triangle');
  if (params.change === 1) {
    currencyMonitorDots.classList.add('with-dashed-border_success');
    currencyMonitorTriangle.classList.add('currency-monitor__triangle_up');
  }
  if (params.change === -1) {
    currencyMonitorDots.classList.add('with-dashed-border_alert');
    currencyMonitorTriangle.classList.add('currency-monitor__triangle_down');
  }

  setChildren(monitorLine, [
    currencyMonitorPair,
    currencyMonitorDots,
    currencyMonitorRate,
    currencyMonitorTriangle,
  ]);
  return monitorLine;
}

function addCloseSocketFunction(socket) {
  window.addEventListener('popstate', () => {
    socket.close();
  });
  const navContainer = document.getElementById('nav-container');
  const navButtons = navContainer.querySelectorAll('.btn-nav');
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      socket.close();
    });
  });
}

export function startCurrencyMonitoring() {
  const parent = document.querySelector('.currency-monitor__monitor');
  const socket = getChangedCurrency();

  socket.then((response) => {
    let i = 0;
    let itemSumHeight = 0;
    addCloseSocketFunction(response);

    response.onmessage = function message(event) {
      const parentHeight =
        parent.clientHeight -
        parseInt(getComputedStyle(parent)['padding-bottom'], 10);

      const element = createMonitorLine(event.data);

      if (i === 1) {
        const item = parent.querySelector('.currency-monitor__line');
        const itemHeight = item.offsetHeight;
        itemSumHeight =
          itemHeight + parseInt(getComputedStyle(item)['margin-bottom'], 10);
      }

      mount(parent, element);
      i++;

      if (i * itemSumHeight > parentHeight) {
        i--;
        unmount(parent, parent.querySelector('.currency-monitor__line'));
      }
    };
  });
}

export function createCurrencyMonitor() {
  const currencyMonitor = el('.currency-monitor.bord-radius-50px.padding-50px');
  const currencyMonitorHeader = el(
    'h3.mini-header',
    'Изменение курсов в реальном времени'
  );
  const monitor = el('.currency-monitor__monitor');
  setChildren(currencyMonitor, [currencyMonitorHeader, monitor]);
  return currencyMonitor;
}

export function createCurrencyExchangeWrapper() {
  const wrapperLeft = el('.currency-exchange-wrapper__left', [
    createOwnCurrency(),
    createCurrencyExchange(),
  ]);

  const wrapperRight = el('.currency-exchange-wrapper__right', [
    createCurrencyMonitor(),
  ]);

  const wrapper = el('.currency-exchange-wrapper', [wrapperLeft, wrapperRight]);

  return wrapper;
}
