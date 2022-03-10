import BigNumber from 'bignumber.js';
import { Contract, ContractReceipt, ContractTransaction } from 'ethers';

export class NomBondingCurve {
  private bondContract: Contract;

  private bNomContract: Contract;

  private gravityContract: Contract;

  constructor(bondContract: Contract, bNomContract: Contract, gravityContract: Contract) {
    this.bondContract = bondContract;
    this.bNomContract = bNomContract;
    this.gravityContract = gravityContract;
  }

  public async bNomIncreaseAllowance(
    destinationAddress: string,
    amountAtoms: BigNumber,
    gasPriceAtoms: BigNumber
  ): Promise<[ContractReceipt, ContractTransaction]> {
    const tx: ContractTransaction = await this.bNomContract.increaseAllowance(
      destinationAddress,
      amountAtoms.toFixed(0),
      {
        gasPrice: gasPriceAtoms.toFixed(0),
      }
    );
    const receipt = await tx.wait();
    return [receipt, tx];
  }

  public bNomIncreaseBridgeAllowance(amountAtoms: BigNumber, gasPriceAtoms: BigNumber) {
    return this.bNomIncreaseAllowance(this.gravityContract.address, amountAtoms, gasPriceAtoms);
  }

  public bNomIncreaseBondAllowance(amountAtoms: BigNumber, gasPriceAtoms: BigNumber) {
    return this.bNomIncreaseAllowance(this.bondContract.address, amountAtoms, gasPriceAtoms);
  }
}
