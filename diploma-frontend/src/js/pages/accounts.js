import { el, setChildren } from 'redom';
import { apiGetAccounts, apiCreateAccount } from '../api/api';
import router from '../bundle/router';
import { amountFormater } from '../helpers/amountViewFormating';
import dateFormater from '../helpers/dateFormater';
import sortingChoices from '../bundle/choices-options';
import { createAccButtonIcon } from '../svg-assets/svgs';

const subContainer = document.getElementById('sub-container');
const appContainer = document.getElementById('app-container');

function createAccountCard(accountId, balance, date = null) {
  const card = el('.card.with-shadow');
  let checkedDate = 'Не было транзакций';
  if (date) {
    checkedDate = dateFormater(date, 'full');
  }

  const account = el('h3.card__account', accountId);
  const amount = el('span.card__amount', `${amountFormater(balance)} ₽`);
  const text = el('span.card__text', 'Последняя транзакция:');
  const transactionDate = el('span.card__transaction-date', checkedDate);
  const openAccountBtn = el(
    'button.btn-reset.btn.btn-primary.btn-med.open-account-btn',
    'Открыть'
  );
  openAccountBtn.addEventListener('click', () => {
    router.navigate(`/account/${accountId}`);
  });

  setChildren(card, [account, amount, text, transactionDate, openAccountBtn]);
  return card;
}

export function showUserAccounts(sort) {
  const token = sessionStorage.getItem('token');
  const accountsContainer = el('.accounts-container');
  const userAccounts = apiGetAccounts(token);

  userAccounts.then((data) => {
    function accSorting(sortingBy) {
      data.payload.sort((prev, next) => {
        if (sortingBy === 'transactions') {
          let prevDate = 0;
          let nextDate = 0;
          if (prev[sortingBy][0] !== undefined) {
            prevDate = Number(new Date(prev[sortingBy][0].date));
          }
          if (next[sortingBy][0] !== undefined) {
            nextDate = Number(new Date(next[sortingBy][0].date));
          }
          return prevDate - nextDate;
        }
        return prev[sortingBy] - next[sortingBy];
      });
    }
    accSorting(sort);

    const accCardsArr = [];
    data.payload.forEach((acc) => {
      if (acc.transactions.length === 0) {
        acc.transactions[0] = { date: null };
      }
      const card = createAccountCard(
        acc.account,
        acc.balance,
        acc.transactions[0].date
      );
      accCardsArr.push(card);
    });
    setChildren(accountsContainer, accCardsArr);
  });
  return accountsContainer;
}

export function createAccountsSubheader() {
  const subheader = el('.subheader-container');
  const left = el('.subheader__left');
  const right = el('.subheader__right');

  setChildren(subheader, [left, right]);

  const header = el('h2.page-subheader', 'Ваши счета');

  const sorting = el('select.control-container__select');

  const createAccBtn = el('button.btn-reset.btn.btn-primary.btn-with-icon');
  createAccBtn.innerHTML = createAccButtonIcon;

  createAccBtn.addEventListener('click', async () => {
    const token = sessionStorage.getItem('token');
    await apiCreateAccount(token);
    renderAccountsList();
  });

  setChildren(left, [header, sorting]);
  setChildren(right, createAccBtn);
  return subheader;
}

export function renderAccountsList() {
  setChildren(subContainer, createAccountsSubheader());
  setChildren(appContainer, showUserAccounts());
  sortingChoices(showUserAccounts);
}
