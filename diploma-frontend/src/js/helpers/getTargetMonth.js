export default function getTargetMonth(howDeep) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const targetMonth = currentMonth - (howDeep - 1);
  const targetDate = new Date(currentYear, targetMonth);
  return targetDate;
}
