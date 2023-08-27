import { el } from 'redom';
import inputValidate from '../src/js/helpers/input-validate';

const testInput = el('input');
const testInputParent = el('.test-parent', [testInput]);

test('Проверка инпута на нулевое значение', () => {
  expect(inputValidate(testInput)).toBe(false);
});

test('При наличие ошибки input получает класс input-error', () => {
  inputValidate(testInput);
  expect(testInput).toHaveClass('input-error');
});

test('При наличие ошибки в родительском элемента создается span с классом input-error-message', () => {
  const expectedOuterHTML =
    '<div class="test-parent"><input class="input-error"><span class="input-error-message">Поле должно быть заполнено</span></div>';
  inputValidate(testInput);
  expect(testInputParent.outerHTML).toBe(expectedOuterHTML);
});

test('При проверке логина появляется ошибка если меньше шести символов и логин содержит пробел', () => {
  const expectedOuterHTML =
    '<div class="test-parent"><input class="input-error"><span class="input-error-message">Введено менее 6 символов, Поле содержит пробел</span></div>';
  testInput.value = 'de vl';
  inputValidate(testInput, 'login');
  expect(testInputParent.outerHTML).toBe(expectedOuterHTML);
});

test('При проверке попытки отправки нулевой суммы выводится ошибка "Сумма должна быть больше нуля"', () => {
  const expectedOuterHTML =
    '<div class="test-parent"><input class="input-error"><span class="input-error-message">Сумма должна быть больше нуля</span></div>';
  testInput.value = '0.0000';
  inputValidate(testInput);
  expect(testInputParent.outerHTML).toBe(expectedOuterHTML);
});

test('Корректные значения (логин из 6 и более символов, без пробелов, или форматированная по маске сумма) обрабатываются успешно', () => {
  testInput.value = 'developer';
  expect(inputValidate(testInput, 'login')).toBe(true);
  testInput.value = '123 456.0123';
  expect(inputValidate(testInput)).toBe(true);
});
