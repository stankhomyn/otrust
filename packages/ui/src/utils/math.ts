import { BigNumber } from 'bignumber.js';

export function chopFloat(value: number, precision: number) {
  return Math.round(value * 10 ** precision) / 10 ** precision;
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function truncate(str: string, maxDecimalDigits: number) {
  if (str.includes('.')) {
    const parts = str.split('.');
    return `${parts[0]}.${parts[1].slice(0, maxDecimalDigits)}`;
  }
  return str;
}

export function format18(bignumber: BigNumber) {
  return bignumber.div(new BigNumber(10 ** 18));
}

export function parse18(bignumber: BigNumber) {
  return bignumber.times(new BigNumber(10 ** 18));
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
