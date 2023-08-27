import Choices from 'choices.js';
import { setChildren } from 'redom';
import { apiGetAllCurrencies, apiGetUserCurrencies } from '../api/api';

const appContainer = document.getElementById('app-container');

export default function sortingChoices(renderFunction) {
  const element = document.querySelector('.control-container__select');
  // eslint-disable-next-line no-unused-vars
  const customSelect = new Choices(element, {
    choices: [
      {
        value: '',
        label: 'Сортировка',
        placeholder: true,
      },
      {
        value: 'account',
        label: 'По номеру',
        id: 1,
      },
      {
        value: 'balance',
        label: 'По балансу',
        id: 2,
      },
      {
        value: 'transactions',
        label: 'По последней транзакции',
        id: 3,
      },
    ],
    allowHTML: false,
    searchEnabled: false,
    position: 'auto',
    shouldSort: false,
    renderSelectedChoices: 'auto',
    itemSelectText: '',
  });

  element.addEventListener(
    'choice',
    (event) => {
      const sort = event.detail.choice.value;
      setChildren(appContainer, renderFunction(sort));
    },
    false
  );
}

export async function selectChoices(result) {
  const selectElements = document.querySelectorAll('.change-currency-select');

  selectElements.forEach(async (element) => {
    const choiceValuesArray = [];
    const direct = element.getAttribute('id');

    let apiCurrencies;
    if (direct === 'from') {
      if (result) {
        apiCurrencies = result;
      } else {
        const token = sessionStorage.getItem('token');
        apiCurrencies = await apiGetUserCurrencies(token);
      }
    }
    if (direct === 'to') {
      apiCurrencies = await apiGetAllCurrencies();
    }

    const currencies = apiCurrencies.payload;
    for (const key in currencies) {
      if (Array.isArray(currencies)) {
        // to
        const el = {
          value: currencies[key],
          label: currencies[key],
        };
        choiceValuesArray.push(el);
      } else if (currencies[key].amount > 0) {
        // from
        choiceValuesArray.push({
          value: key,
          label: key,
        });
      }
    }

    // eslint-disable-next-line no-unused-vars
    const customSelect = new Choices(element, {
      choices: choiceValuesArray,
      allowHTML: false,
      searchEnabled: false,
      position: 'auto',
      renderSelectedChoices: 'auto',
      itemSelectText: '',
    });

    element.addEventListener(
      'choice',
      () => {
        const amountField = document.getElementById('amount');
        amountField.value = '';
      },
      false
    );
  });
}
