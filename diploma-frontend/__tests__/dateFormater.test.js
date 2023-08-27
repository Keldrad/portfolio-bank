import dateFormater from '../src/js/helpers/dateFormater';

test('Функция dateFormater c параметром full корректно преобразует значение Date к виду: 21 мая 2023', () => {
  expect(dateFormater('2023-05-21T14:35:51.103Z', 'full')).toBe('21 мая 2023');
});

test('Функция dateFormater без параметров корректно преобразует значение Date к виду: 21.05.2023', () => {
  expect(dateFormater('2023-05-21T14:35:51.103Z')).toBe('21.05.2023');
});

test('Функция dateFormater с параметром month возвращает только значение месяца', () => {
  expect(dateFormater('2023-05-21T14:35:51.103Z', 'month')).toBe('май');
});
