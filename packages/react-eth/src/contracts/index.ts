/* eslint-disable import/no-extraneous-dependencies */
// TODO: typechain types would be nice
import { Contract } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';

import NomContractJSON from './ERC20NOM.json';
import BondingContractJSON from './BondingNOM.json';
import UniswapContractJSON from './UniSwap.json';
import GravityContractJSON from './Gravity.json';

const uniswapUsdcAddress = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc';

/**
 * NOM ERC20 Contract instance
 */
export function NOMCont(address: string, signer?: Signer) {
  const ABI = NomContractJSON.abi;
  return new Contract(address, ABI, signer);
}

/**
 * Haven Contract instance
 */
export function BondingCont(address: string, signer?: Signer) {
  const ABI = BondingContractJSON.abi;
  return new Contract(address, ABI, signer);
}

/**
 * UniSwap Contract instance
 */
export function UniSwapCont(signer?: Signer) {
  const ABI = UniswapContractJSON;
  return new Contract(uniswapUsdcAddress, ABI, signer);
}

export function GravityCont(address: string, signer?: Signer) {
  const ABI = GravityContractJSON.abi;
  return new Contract(address, ABI, signer);
}
