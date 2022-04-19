import ethers from 'ethers';
import { WalletErrors } from "../WalletErrors";
import { AbstractWallet } from "./AbstractWallet";

export abstract class EthereumWallet extends AbstractWallet {
  async getSigner(): Promise<ethers.Signer> {
    throw new WalletErrors.NotSupported(
      "EthereumWallet.getSigner not supported"
    );
  }

  async getProvider(): Promise<ethers.providers.Provider> {
    throw new WalletErrors.NotSupported(
      "EthereumWallet.getProvider not supported"
    );
  }
}
