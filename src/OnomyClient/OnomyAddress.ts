// based on https://github.com/luniehq/lunie-light/blob/master/common/address.js#L32
import { bech32 } from 'bech32';

function decodeB32(value: string) {
  const words = bech32.decode(value);
  return Buffer.from(bech32.fromWords(words.words)).toString(`hex`);
}

function encodeB32(value: string, prefix = 'onomy', type = 'hex') {
  // @ts-ignore
  const words = bech32.toWords(Buffer.from(value, type));
  return bech32.encode(prefix, words);
}

export const OnomyAddress = {
  encodeB32,
  decodeB32,
};
