// Набор других счетов, которые не принадлежат пользователю, но гарантированно существуют. С их помощью вы можете проверять функционал перечисления средств со счёта на счёт:
// 61253747452820828268825011
// 05168707632801844723808510
// 17307867273606026235887604
// 27120208050464008002528428
// 2222400070000005
// 5555341244441115

import { el, mount, setChildren } from 'redom';
import { apiGetAccountInfo, apiTransferFunds } from '../api/api';
import { amountFormater, amountUnformat } from '../helpers/amountViewFormating';
import {
  onlyNubersInInput,
  inputAmountValueFormater,
} from '../helpers/inputFormater';
import dateFormater from '../helpers/dateFormater';
import router from '../bundle/router';
import createInput from '../elements/input';
import {
  createAutosuggestList,
  deleteAutosuggestList,
  autoSuggestCorrection,
} from '../elements/autosuggest';
import createSnackbar from '../elements/snackbar';
import inputValidate from '../helpers/input-validate';
import createChart from '../bundle/chart';
import getTargetMonth from '../helpers/getTargetMonth';
import {
  toStartTransactionsHistoryArrow,
  toEndTransactionsHistoryArrow,
  transferButtonIcon,
  backButtonsIcon,
} from '../svg-assets/svgs';

const shortHistory = 10;
const longHistory = 25;
let currentPage = 1;
const paginationButtonsToShow = 3;

export function createAccountSubheader(id) {
  const subheader = el('.subheader-container.subheader-container_details');
  const top = el('.subheader__top');
  const bottom = el('.subheader__bottom');
  setChildren(subheader, [top, bottom]);

  const header = el('h2.page-subheader', 'Просмотр счета');

  const backToListBtn = el(
    '.js-back-button.button.btn-reset.btn.btn-primary.btn-with-icon'
  );
  backToListBtn.innerHTML = `${backButtonsIcon} Вернуться назад`;
  backToListBtn.onclick = function backToList() {
    router.navigate('/accounts');
  };

  setChildren(top, [header, backToListBtn]);

  const accNumber = el('span.subheader__account-number', `№ ${id}`);
  const balance = el('span.#balance.subheader__balance', '0');
  setChildren(bottom, [accNumber, balance]);

  return subheader;
}

function createTransactionsHistory(
  transactionsDataArray,
  id,
  nFromEnd = shortHistory,
  page = 1
) {
  const start = -nFromEnd * page;
  const end = -nFromEnd * (page - 1);

  let lastTransactions = [];
  if (page === 1) {
    lastTransactions = transactionsDataArray.slice(start);
  } else {
    lastTransactions = transactionsDataArray.slice(start, end);
  }

  const transactionsHistory = el(
    '.transactions-history.bord-radius-50px.with-grey-background.padding-25px-50px'
  );

  if (nFromEnd === shortHistory) {
    transactionsHistory.classList.add('transactions-history_clickable');
  }

  let pagination = '';

  if (transactionsDataArray.length > longHistory && nFromEnd === longHistory) {
    pagination = el('.pagination');
    setChildren(pagination, [
      createTransactionHistoryPagination(
        transactionsDataArray,
        id,
        longHistory,
        currentPage
      ),
    ]);
  }

  const transactionsHistoryHeader = el('h3.mini-header', 'История переводов');
  const transactionsTable = el('.transactions-table');

  setChildren(transactionsHistory, [
    transactionsHistoryHeader,
    pagination,
    transactionsTable,
  ]);

  const headerOrder = ['Счет отправителя', 'Счет получателя', 'Сумма', 'Дата'];

  headerOrder.forEach((element, index) => {
    const transactionTableLists = el('ol.transfer-history-col');
    mount(transactionsTable, transactionTableLists);

    const transactionTableListHeader = el(
      'li.transfer-history__item.transfer-history__item_header',
      headerOrder[index]
    );
    mount(transactionTableLists, transactionTableListHeader);

    let key;
    switch (headerOrder[index]) {
      case 'Счет отправителя':
        key = 'from';
        break;
      case 'Счет получателя':
        key = 'to';
        break;
      case 'Сумма':
        key = 'amount';
        break;
      case 'Дата':
        key = 'date';
        break;
      default:
        break;
    }

    for (let i = lastTransactions.length - 1; i > -1; i--) {
      let ItemTextContent = lastTransactions[i][key];

      if (key === 'date') {
        ItemTextContent = dateFormater(lastTransactions[i][key], 'short');
      }

      const transactionTableListItem = el(
        'li.transfer-history__item',
        ItemTextContent
      );

      if (key === 'amount') {
        let symbol = '';
        if (id === lastTransactions[i].to) {
          symbol = '+';
          transactionTableListItem.classList.add(
            'transfer-history__item_amount-plus'
          );
        }
        if (id === lastTransactions[i].from) {
          symbol = '-';
          transactionTableListItem.classList.add(
            'transfer-history__item_amount-minus'
          );
        }
        transactionTableListItem.textContent = amountFormater(
          `${symbol} ${lastTransactions[i][key]} ₽`
        );
      }
      mount(transactionTableLists, transactionTableListItem);
    }
  });

  return transactionsHistory;
}

function createTransactionHistoryPagination(transactions, id) {
  const paginationWrapper = el('.pagination-wrapper');
  const toStartPageBtn = el('button.pagination-button', '');
  toStartPageBtn.innerHTML = toStartTransactionsHistoryArrow;
  const historyWrapper = document.getElementById(
    'transactions-history-wrapper'
  );

  toStartPageBtn.onclick = function goToStartOfHistory() {
    currentPage = 1;
    setChildren(
      historyWrapper,
      createTransactionsHistory(transactions, id, longHistory, currentPage)
    );
  };

  const toEndPageBtn = el('button.pagination-button', '');
  toEndPageBtn.innerHTML = toEndTransactionsHistoryArrow;
  toEndPageBtn.onclick = function goToEndOfHistory() {
    currentPage = Math.ceil(transactions.length / longHistory);
    setChildren(
      historyWrapper,
      createTransactionsHistory(transactions, id, longHistory, currentPage)
    );
  };

  mount(paginationWrapper, toStartPageBtn);

  function goToPage(index) {
    currentPage = index + 1;
    setChildren(
      historyWrapper,
      createTransactionsHistory(transactions, id, longHistory, currentPage)
    );
  }

  for (let index = 0; index < transactions.length / longHistory; index++) {
    const paginationPage = el('button.pagination-button', index + 1);

    if (index + 1 === currentPage) {
      paginationPage.classList.add('pagination-button_active');
    } else {
      paginationPage.onclick = () => {
        goToPage(index);
      };
    }

    let firstShownPage = paginationButtonsToShow;
    let stepsToLastShownPage = paginationButtonsToShow;

    if (currentPage - paginationButtonsToShow < 1) {
      stepsToLastShownPage +=
        Math.abs(currentPage - paginationButtonsToShow) + 1;
    }

    if (
      currentPage + stepsToLastShownPage >
      transactions.length / longHistory
    ) {
      firstShownPage +=
        Math.abs(
          Math.floor(transactions.length / longHistory) -
            (currentPage + stepsToLastShownPage)
        ) - 1;
    }

    if (
      index + 1 < currentPage - firstShownPage ||
      index + 1 > currentPage + stepsToLastShownPage
    ) {
      paginationPage.classList.add('display-none');
    }
    mount(paginationWrapper, paginationPage);
  }

  mount(paginationWrapper, toEndPageBtn);
  return paginationWrapper;
}

function cropData(data, howDeep) {
  const targetMonth = getTargetMonth(howDeep);
  const croppedData = [];
  data.forEach((element) => {
    if (new Date(element.date) > targetMonth) {
      croppedData.push(element);
    }
  });
  return croppedData;
}

function createChartContent(
  data,
  from,
  howManyMonthToShow = 6,
  stackedView = false,
  headerText = 'Динамика баланса'
) {
  const chartHeader = el('h3.mini-header', headerText);
  const chartElement = el('canvas#chart.chart', { width: '100%' });
  const chartContainer = el('.chart-container', [chartElement]);

  const croppedData = cropData(data, howManyMonthToShow);

  createChart(chartElement, croppedData, from, stackedView);
  const chartContent = el(
    '#chart-content.chart-content.bord-radius-50px.with-shadow.padding-25px-50px',
    [chartHeader, chartContainer]
  );

  if (howManyMonthToShow === 6) {
    chartContent.classList.add('chart-content_clickable');
  }

  return chartContent;
}

function checkTransaction(from) {
  let previuosUsedAccounts = [];
  const token = sessionStorage.getItem('token');

  if (localStorage.getItem(token)) {
    previuosUsedAccounts = localStorage.getItem(token).split(',');
  }

  const accountNumbInput = document.getElementById('account-number');
  const amountInput = document.getElementById('amount');
  const accountNumbValidateResult = inputValidate(accountNumbInput, 'transfer');
  const to = accountNumbInput.value;
  if (to === from) {
    document.body.append(
      createSnackbar('error', 'Счет получателя совпадает со счетом отправителя')
    );
    accountNumbInput.classList.add('input-error');
    return;
  }

  const amount = amountUnformat(amountInput.value);
  const amountValidateResult = inputValidate(amountInput, 'transfer');

  if (accountNumbValidateResult && amountValidateResult) {
    const transferResult = apiTransferFunds(from, to, amount, token);
    transferResult
      .then((res) => {
        // перерисовка истории переводов и bar chart
        const transactionsHistoryWrapper = document.getElementById(
          'transactions-history-wrapper'
        );
        setChildren(
          transactionsHistoryWrapper,
          createTransactionsHistory(res.payload.transactions, from)
        );

        transactionsHistoryWrapper.onclick = function viewRouter() {
          showDetailedView(res.payload.transactions, from);
        };

        const chartWrapper = document.getElementById('chart-wrapper');
        setChildren(
          chartWrapper,
          createChartContent(res.payload.transactions, from)
        );

        chartWrapper.onclick = function viewRouter() {
          showDetailedView(res.payload.transactions, from);
        };

        const balance = document.getElementById('balance');
        balance.textContent = amountFormater(res.payload.balance);
        accountNumbInput.value = '';
        amountInput.value = '';
        if (!previuosUsedAccounts.includes(to)) {
          previuosUsedAccounts.push(to);
          localStorage.setItem(token, previuosUsedAccounts);
        }
      })
      .catch((error) => {
        const snackbar = createSnackbar('error', error.message);
        document.body.append(snackbar);
      });
  }
}

function createTransferForm(accountId) {
  const transferForm = el(
    '.transfer-form-wrapper.bord-radius-50px.with-grey-background.padding-25px-50px'
  );

  const transferFormHeader = el('h3.mini-header', 'Новый перевод');

  const transferAccountNumberInput = createInput('account-number');
  const accountNumberLine = el(
    '.form__line.transfer-form__line_account-number',
    [transferAccountNumberInput]
  );

  transferAccountNumberInput.addEventListener('input', onlyNubersInInput);
  transferAccountNumberInput.addEventListener('input', autoSuggestCorrection);
  transferAccountNumberInput.addEventListener('focusin', createAutosuggestList);
  transferAccountNumberInput.addEventListener('focusin', autoSuggestCorrection);
  transferAccountNumberInput.addEventListener(
    'focusout',
    deleteAutosuggestList
  );

  const transferAmountInput = createInput('amount');
  transferAmountInput.setAttribute('autocomplete', 'off');

  const accountAmountLine = el('.form__line.transfer-form__line_amount', [
    transferAmountInput,
  ]);

  transferAmountInput.addEventListener('input', inputAmountValueFormater);

  const transferButton = el('button.btn-reset.btn.btn-primary.btn-with-icon');
  transferButton.innerHTML = `${transferButtonIcon} Отправить`;
  transferButton.addEventListener('click', () => {
    checkTransaction(accountId);
  });

  const transferFormWrapper = el('.transfer-form', [
    accountNumberLine,
    accountAmountLine,
    transferButton,
  ]);

  setChildren(transferForm, [transferFormHeader, transferFormWrapper]);
  return transferForm;
}

function showDetailedView(data, from) {
  const backToListBtn = document.querySelector('.js-back-button');

  backToListBtn.onclick = function backToAccountDetails() {
    const subContainer = document.getElementById('sub-container');
    const appContainer = document.getElementById('app-container');

    setChildren(appContainer, []);
    setChildren(subContainer, createAccountSubheader(from));
    setChildren(appContainer, showAccountDetails(from));
  };

  const parrent = document.querySelector('.account-details__upper-line');

  parrent.classList.add('account-details__upper-line_flex-column');

  const chartBalanceWrapper = el('.chart-wrapper_wide');
  const chartColoredBalanceWrapper = el('.chart-wrapper_wide');
  setChildren(parrent, [chartBalanceWrapper, chartColoredBalanceWrapper]);

  setChildren(
    chartBalanceWrapper,
    createChartContent(data, from, 12, false, false)
  );
  setChildren(
    chartColoredBalanceWrapper,
    createChartContent(
      data,
      from,
      12,
      true,
      false,
      'Соотношение входящих исходящих транзакций'
    )
  );

  const historyWrapper = document.querySelector(
    '.transactions-history-wrapper'
  );
  setChildren(
    historyWrapper,
    createTransactionsHistory(data, from, longHistory)
  );
}

export function showAccountDetails(id) {
  currentPage = 1;
  const token = sessionStorage.getItem('token');
  const accountInfo = apiGetAccountInfo(id, token);

  const transactionsHistoryWrapper = el(
    '#transactions-history-wrapper.transactions-history-wrapper'
  );

  const chartWrapper = el('#chart-wrapper.chart-wrapper');

  const upperLine = el('.account-details__upper-line', [
    createTransferForm(id),
    chartWrapper,
  ]);

  const accountDetailsWrapper = el('.account-details-wrapper', [
    upperLine,
    transactionsHistoryWrapper,
  ]);

  accountInfo.then((data) => {
    const balanceAmount = document.getElementById('balance');
    balanceAmount.textContent = amountFormater(data.payload.balance);
    setChildren(
      chartWrapper,
      createChartContent(data.payload.transactions, id)
    );
    const transactionsHistory = createTransactionsHistory(
      data.payload.transactions,
      id
    );
    setChildren(transactionsHistoryWrapper, transactionsHistory);

    transactionsHistory.onclick = function viewRouter() {
      showDetailedView(data.payload.transactions, id);
    };

    chartWrapper.onclick = function viewRouter() {
      showDetailedView(data.payload.transactions, id);
    };
  });

  return accountDetailsWrapper;
}
