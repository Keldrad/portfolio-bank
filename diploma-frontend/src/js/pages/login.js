import { el } from 'redom';
import { apiLogin } from '../api/api';
import createSnackbar from '../elements/snackbar';
import router from '../bundle/router';
import createInput from '../elements/input';
import inputValidate from '../helpers/input-validate';

function checkLogin() {
  const loginInput = document.getElementById('login');
  const passwordInput = document.getElementById('password');
  const loginValidateResult = inputValidate(loginInput, 'login');
  const passwordValidateResult = inputValidate(passwordInput, 'login');
  if (loginValidateResult && passwordValidateResult) {
    const loginResult = apiLogin(loginInput.value, passwordInput.value);
    loginResult
      .then((token) => {
        sessionStorage.setItem('token', token);
        router.navigate('/accounts');
      })
      .catch((error) => {
        const snackbar = createSnackbar('error', error.message);
        document.body.append(snackbar);
      });
  }
}

const loginButton = el('button.btn-reset.btn.btn-sm.btn-primary', 'Войти');
loginButton.addEventListener('click', checkLogin);

export default function createLoginModal() {
  return el('.login-modal.bord-radius-50px.with-grey-background', [
    el('h1.login-modal__header', 'Вход в аккаунт'),
    el('.form__line.form__line_log', [createInput('login')]),
    el('.form__line.form__line_pswd', [createInput('password')]),
    loginButton,
  ]);
}
