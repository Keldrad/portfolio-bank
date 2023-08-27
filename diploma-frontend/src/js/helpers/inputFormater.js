import { amountFormater } from './amountViewFormating';

let prevVal = '';

export function onlyNubersInInput() {
  const regexp = /[^0-9]/g;
  this.value = this.value.replaceAll(regexp, '');
}

export function inputAmountValueFormater(event) {
  const regexp = /[^0-9.]/g;
  if (this.value.startsWith('.')) {
    this.value = `0${this.value}`;
  }

  if (event.data === '.') {
    const dotIndex = this.value.indexOf('.');
    const secondDot = this.value.indexOf('.', dotIndex + 1);
    if (secondDot > -1) {
      this.value = prevVal;
    }
  }

  if (event.data === '0' && this.value.length === 1) {
    this.value += '.';
  }

  if (event.data === '.' && this.value.length === 1) {
    this.value = '0.';
  }

  if (
    event.inputType === 'deleteContentBackward' &&
    String(this.value) === '0'
  ) {
    this.value = '';
  }

  if (typeof event.data !== 'object' && event.data.match(regexp)) {
    this.value = prevVal;
  }

  this.value = this.value.replaceAll(regexp, '');

  while (
    this.value.startsWith('0') &&
    !this.value.startsWith('0.') &&
    this.value.length > 2
  ) {
    this.value = this.value.substring(1);
  }

  if (this.value.includes('.')) {
    const firstDotIndex = this.value.indexOf('.');
    let lastDotIndex = this.value.lastIndexOf('.');
    while (firstDotIndex !== lastDotIndex) {
      this.value =
        this.value.substring(0, lastDotIndex) +
        this.value.substring(lastDotIndex + 1);
      lastDotIndex = this.value.lastIndexOf('.');
    }
  }

  this.value = amountFormater(this.value);
  prevVal = this.value;
}
