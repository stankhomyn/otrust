import { EthereumWallet } from "@onomy/wallet";
import ethers from 'ethers';

export class WrappedEthereumWallet extends EthereumWallet {
  private provider?: ethers.providers.Provider;
  private signer?: ethers.Signer;

  constructor(provider?: ethers.providers.Provider, signer?: ethers.Signer) {
    super();
    this.provider = provider;
    this.signer = signer;
  }

  async getSigner() {
    if (!this.signer) throw new Error("No Ethereum Signer Available");
    return this.signer;
  }

  async getProvider() {
    if (!this.provider) return super.getProvider();
    return this.provider;
  }
}
