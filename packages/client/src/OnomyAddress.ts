// based on https://github.com/luniehq/lunie-light/blob/master/common/address.js#L32
import { bech32 } from 'bech32';
// @ts-ignore
import cosmos from 'cosmos-lib';

function decodeB32(value: string): string {
  const words = bech32.decode(value);
  // @ts-ignore
  return Buffer.from(bech32.fromWords(words.words)).toString(`hex`);
}

function encodeB32(value: string, prefix = 'onomy', type = 'hex') {
  // @ts-ignore
  const words = bech32.toWords(Buffer.from(value, type));
  return bech32.encode(prefix, words);
}

function validate(value: string) {
  // TODO: I think there is probably a better way to validate?
  cosmos.address.getBytes(value);
  return true;
}

export const OnomyAddress = {
  encodeB32,
  decodeB32,
  validate,
};
