export function amountFormater(value) {
  const reg = /(\d)(?=(\d\d\d)+\b)/gi;
  const str = String(value);
  const trimmedStr = str.trim();
  const dotIndex = trimmedStr.indexOf('.');
  let beforeDot = '';
  let afterDot = '';

  if (dotIndex !== -1) {
    afterDot = trimmedStr.slice(dotIndex);
    beforeDot = trimmedStr.slice(0, dotIndex);
  } else {
    beforeDot = trimmedStr;
  }
  beforeDot = beforeDot.replace(reg, '$1 ');
  const resStr = beforeDot + afterDot;
  return resStr;
}

export function amountUnformat(value) {
  return value.split(' ').join('');
}
