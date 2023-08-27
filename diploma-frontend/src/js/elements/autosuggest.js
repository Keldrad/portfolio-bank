import { el, mount } from 'redom';

function createAutosuggestItem(accountNumber) {
  const item = el('.autosuggest-item', accountNumber);
  const accountNumberInput = document.getElementById('account-number');
  item.addEventListener('click', () => {
    accountNumberInput.value = accountNumber;
  });
  return item;
}

export function createAutosuggestList() {
  const token = sessionStorage.getItem('token');
  const parent = document.querySelector('.transfer-form__line_account-number');
  const nearInput = document.getElementById('account-number');

  if (localStorage.getItem(token) !== null) {
    const previuosUsedAccounts = localStorage.getItem(token).split(',');

    const autosuggestListWrapper = el('.autosuggest-wrapper.with-shadow');

    if (previuosUsedAccounts.length > 0) {
      autosuggestListWrapper.setAttribute(
        'style',
        `top: ${nearInput.offsetHeight + 4}px`
      );
      previuosUsedAccounts.forEach((account) => {
        mount(autosuggestListWrapper, createAutosuggestItem(account));
      });
    }

    mount(parent, autosuggestListWrapper);
  }
}

export function deleteAutosuggestList() {
  const autosuggestList = document.querySelector('.autosuggest-wrapper');
  if (autosuggestList) {
    setTimeout(() => {
      autosuggestList.remove();
    }, 150);
  }
}

export function autoSuggestCorrection() {
  const items = document.querySelectorAll('.autosuggest-item');
  if (items.length > 0) {
    items.forEach((item) => {
      if (!item.innerHTML.startsWith(this.value)) {
        item.classList.add('display-none');
      }
      if (item.innerHTML.startsWith(this.value)) {
        item.classList.remove('display-none');
      }
      if (item.innerHTML === this.value) {
        item.classList.add('display-none');
      }
    });

    const hidden = document.querySelectorAll('.autosuggest-item.display-none');

    const wrapper = document.querySelector('.autosuggest-wrapper');
    if (hidden.length === items.length) {
      wrapper.classList.add('display-none');
    }
    if (hidden.length !== items.length) {
      wrapper.classList.remove('display-none');
    }
  }
}
