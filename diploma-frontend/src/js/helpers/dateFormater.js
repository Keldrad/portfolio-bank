export default function dateFormater(date, view = 'short') {
  let options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };

  if (view === 'full') {
    options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  }

  if (view === 'month') {
    options = {
      month: 'long',
    };
  }

  const parseDate = new Date(date);
  let resDate = parseDate.toLocaleString('ru', options);
  if (view === 'full') {
    resDate = resDate.slice(0, -3);
  }
  return resDate;
}
