export default function getMonth(date, view) {
  const months = [
    'ЯНВ',
    'ФЕВ',
    'МАР',
    'АПР',
    'МАЙ',
    'ИЮН',
    'ИЮЛ',
    'АВГ',
    'СЕН',
    'ОКТ',
    'НОЯ',
    'ДЕК',
  ];
  const parseDate = new Date(date);
  const monthNumb = parseDate.getMonth();

  if (view === 'letters') {
    return months[monthNumb];
  }

  return monthNumb;
}
