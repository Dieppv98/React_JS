import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}

export function fCurrencyVND(number) {
  let val = Math.abs(number);
  if (val >= 1000 && val < 1000000) {
    val = `${(val / 1000).toFixed(0)}K`;
  }
  if (val >= 1000000 && val < 1000000000) {
    val = `${(val / 1000000).toFixed(0)}M`;
  }
  if (val >= 1000000000) {
    val = `${(val / 1000000000).toFixed(0)}B`;
  }
  return val;
}
