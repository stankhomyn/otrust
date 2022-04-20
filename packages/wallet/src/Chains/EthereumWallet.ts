import { providers, Signer } from 'ethers';
import { WalletErrors } from "../WalletErrors";
import { AbstractWallet } from "./AbstractWallet";

export abstract class EthereumWallet extends AbstractWallet {
  protected wsProvider?: providers.WebSocketProvider;
  async getSigner(): Promise<Signer> {
    throw new WalletErrors.NotSupported(
      "EthereumWallet.getSigner not supported"
    );
  }

  async getProvider(): Promise<providers.Provider> {
    if (this.wsProvider) return this.wsProvider;
    // TODO: make url configurable
    this.wsProvider = new providers.WebSocketProvider('wss://rinkeby.infura.io/ws/v3/81ab179bcf0e478fb8eae23101aec2dd');
    return this.wsProvider
  }
}
