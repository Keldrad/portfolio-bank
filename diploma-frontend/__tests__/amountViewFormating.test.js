import {
  amountFormater,
  amountUnformat,
} from '../src/js/helpers/amountViewFormating';

test('Функция amountFormater не разделяет пробелами значение из трех и менее символов', () => {
  expect(amountFormater(123)).toBe('123');
  expect(amountFormater(1)).toBe('1');
});
test('Функция amountFormater разделяет пробелами значение целой части числа', () => {
  expect(amountFormater('1234567890')).toBe('1 234 567 890');
});
test('Функция amountFormater не разделяет значение после точки', () => {
  expect(amountFormater(0.1234567)).toBe('0.1234567');
});
test('Функция amountFormater удаляет пробелы в начале и конце полученной строки и преобразует полученные данные согласно маске', () => {
  expect(amountFormater('    1234567.1234567   ')).toBe('1 234 567.1234567');
});
test('Функция amountFormater преобразует полученное число согласно маске', () => {
  expect(amountFormater(1.1)).toBe('1.1');
  expect(amountFormater(1000.1234)).toBe('1 000.1234');
  expect(amountFormater(1234567.1234567)).toBe('1 234 567.1234567');
});

test('Функция amountUnformat удаляет пробелы и соединяет строку в целую', () => {
  expect(amountUnformat('1 234 567.1234567')).toBe('1234567.1234567');
  expect(amountUnformat('    1 234 567.1234567   ')).toBe('1234567.1234567');
  expect(amountUnformat('    1 234 567.12  345  67   ')).toBe(
    '1234567.1234567'
  );
});
