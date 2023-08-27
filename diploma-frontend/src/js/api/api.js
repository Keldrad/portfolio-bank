export async function apiLogin(login, password) {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
    headers: { 'Content-type': 'application/json' },
  });
  const loginResponse = await response.json();
  if (loginResponse.error === 'Invalid password') {
    throw new Error('Не верный пароль.');
  }
  if (loginResponse.error === 'No such user') {
    throw new Error('Не верный логин. Такого пользователя не существует.');
  }
  return loginResponse.payload.token;
}

export async function apiGetAccounts(token) {
  const response = await fetch('http://localhost:3000/accounts', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });
  const res = await response.json();
  return res;
}

export async function apiGetAccountInfo(id, token) {
  const response = await fetch(`http://localhost:3000/account/${id}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });
  const res = await response.json();
  return res;
}

export async function apiCreateAccount(token) {
  const response = await fetch(`http://localhost:3000/create-account`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });
  const res = await response.json();
  return res;
}

export async function apiTransferFunds(from, to, amount, token) {
  const response = await fetch(`http://localhost:3000/transfer-funds`, {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      'Content-type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });
  const transferResponse = await response.json();
  if (transferResponse.error === `Invalid account from`) {
    throw new Error('Не верный счёт списания.');
  }
  if (transferResponse.error === `Invalid account to`) {
    throw new Error(
      'Не указан счёт зачисления, или этого счёта не существует.'
    );
  }
  if (transferResponse.error === `Invalid amount`) {
    throw new Error('Не верная сумма перевода');
  }
  if (transferResponse.error === `Overdraft prevented`) {
    throw new Error('На счете недостаточно средств.');
  }
  return transferResponse;
}

export async function apiGetAllCurrencies() {
  const response = await fetch(`http://localhost:3000/all-currencies`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });
  const res = await response.json();
  return res;
}

export async function apiGetUserCurrencies(token) {
  const response = await fetch(`http://localhost:3000/currencies`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });
  const res = await response.json();
  return res;
}

export async function apiCurrencyBuy(from, to, amount, token) {
  const response = await fetch(`http://localhost:3000/currency-buy`, {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      'Content-type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });
  const transferResponse = await response.json();
  if (transferResponse.error === `Unknown currency code`) {
    throw new Error('Передан неверный валютный код.');
  }
  if (transferResponse.error === `Not enough currency`) {
    throw new Error('На валютном счёте списания нет средств.');
  }
  if (transferResponse.error === `Invalid amount`) {
    throw new Error('Не верная сумма перевода');
  }
  if (transferResponse.error === `Overdraft prevented`) {
    throw new Error('На счете недостаточно средств.');
  }
  return transferResponse;
}

export async function apiGetBanks() {
  const response = await fetch(`http://localhost:3000/banks`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });
  const res = await response.json();
  return res;
}

export async function getChangedCurrency() {
  return new WebSocket('ws://localhost:3000/currency-feed');
}
