/* eslint-disable import/no-extraneous-dependencies */
// TODO: typechain types would be nice
import { Contract } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/abstract-provider';

import NomContractJSON from './ERC20NOM.json';
import BondingContractJSON from './BondingNOM.json';
import UniswapContractJSON from './UniSwap.json';
import GravityContractJSON from './Gravity.json';

const uniswapUsdcAddress = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc';

type LibParam = { getSigner: () => Signer | Provider | undefined };

/**
 * NOM ERC20 Contract instance
 */
export function NOMCont(library: LibParam, address: string) {
  const ABI = NomContractJSON.abi;
  return new Contract(address, ABI, library?.getSigner());
}

/**
 * Haven Contract instance
 */
export function BondingCont(library: LibParam, address: string) {
  const ABI = BondingContractJSON.abi;
  return new Contract(address, ABI, library?.getSigner());
}

/**
 * UniSwap Contract instance
 */
export function UniSwapCont(library: LibParam) {
  const ABI = UniswapContractJSON;
  return new Contract(uniswapUsdcAddress, ABI, library?.getSigner());
}

export function GravityCont(library: LibParam, address: string) {
  const ABI = GravityContractJSON.abi;
  return new Contract(address, ABI, library.getSigner());
}
